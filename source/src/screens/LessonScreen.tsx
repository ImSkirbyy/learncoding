import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Course, Exercise } from '../types';
import { LessonRef } from '../courses';
import { colors, font, radius } from '../theme';
import { Button, CodeBlock, ProgressBar, Rich } from '../components/ui';
import { Mascot } from '../components/Mascot';
import { Bulb, Check, Cross, Heart } from '../components/Icons';
import { useProgress } from '../progress';

export interface LessonResult {
  xp: number;
  accuracy: number;
  perfect: boolean;
  streakIncreased: boolean;
  lessonTitle: string;
}

type Status = 'answering' | 'right' | 'wrong';

const PRAISE = ['Super!', 'Richtig!', 'Klasse!', 'Stark gemacht!', 'Weiter so!', 'Genau!'];
const COMFORT = ['Nicht ganz …', 'Fast!', 'Kein Problem, weiter geht’s!'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function haptic(ok: boolean) {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => {});
}

export function LessonScreen({ lessonRef, onClose, onFinish }: { lessonRef: LessonRef; onClose: () => void; onFinish: (r: LessonResult) => void }) {
  const insets = useSafeAreaInsets();
  const { state, loseHeart, refillHearts, completeLesson } = useProgress();
  const { course, lesson } = lessonRef;

  const [queue, setQueue] = useState<Exercise[]>(lesson.exercises);
  const [pos, setPos] = useState(0);
  const [status, setStatus] = useState<Status>('answering');
  const [answer, setAnswer] = useState<{ pos: number; v: any }>({ pos: -1, v: null });
  const [showHint, setShowHint] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [requeued] = useState(() => new Set<Exercise>());
  const [outOfHearts, setOutOfHearts] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [message, setMessage] = useState('');

  const ex = queue[pos];
  // Antwort gehört immer zu genau einer Position – so gibt es beim Wechsel keine "alten" Werte.
  const value = answer.pos === pos ? answer.v : ex.type === 'order' ? [] : null;
  const setValue = (v: any) => setAnswer({ pos, v });
  const sheet = useRef(new Animated.Value(0)).current;

  // Antwortmöglichkeiten pro Aufgabe einmal mischen.
  const choices = useMemo(() => {
    if (ex.type === 'choice' || ex.type === 'fill') return shuffle(ex.options);
    if (ex.type === 'order') return shuffle([...ex.parts, ...(ex.distractors ?? [])]);
    return [];
  }, [ex, pos]);

  useEffect(() => setShowHint(false), [pos]);

  useEffect(() => {
    Animated.spring(sheet, { toValue: status === 'answering' ? 0 : 1, useNativeDriver: Platform.OS !== 'web', friction: 8 }).start();
  }, [status]);

  const canCheck = ex.type === 'info' || (ex.type === 'order' ? ((value as number[] | null)?.length ?? 0) > 0 : value != null);

  function solutionText(e: Exercise): string {
    if (e.type === 'choice') return e.options[e.answer];
    if (e.type === 'fill') return e.answer;
    if (e.type === 'order') return e.parts.join(e.mode === 'lines' ? '\n' : ' ');
    return '';
  }

  function isCorrect(): boolean {
    if (ex.type === 'choice') return value === ex.options[ex.answer];
    if (ex.type === 'fill') return value === ex.answer;
    if (ex.type === 'order') {
      const picked = (value as number[]).map((i) => choices[i]);
      // Leerzeichen am Zeilenende zählen nicht – gleich aussehende Bausteine sind austauschbar.
      return picked.length === ex.parts.length && picked.every((p, i) => p.trimEnd() === ex.parts[i].trimEnd());
    }
    return true;
  }

  function check() {
    if (ex.type === 'info') return next();
    const ok = isCorrect();
    haptic(ok);
    setAnswered((n) => n + 1);
    if (ok) {
      setMessage(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
      setStatus('right');
    } else {
      setMessage(COMFORT[Math.floor(Math.random() * COMFORT.length)]);
      setMistakes((m) => m + 1);
      loseHeart();
      // Falsche Aufgaben kommen am Ende noch einmal – so lernt man sie wirklich.
      if (!requeued.has(ex)) {
        requeued.add(ex);
        setQueue((q) => [...q, ex]);
      }
      setStatus('wrong');
    }
  }

  function next() {
    if (status === 'wrong' && state.hearts <= 0) {
      setOutOfHearts(true);
      return;
    }
    const isLast = pos + 1 >= queue.length;
    if (isLast) return finish();
    setStatus('answering');
    setPos((p) => p + 1);
  }

  function finish() {
    const already = (state.completed[lesson.id] ?? 0) > 0;
    const perfect = mistakes === 0;
    const xp = already ? 5 : 10 + (perfect ? 5 : 0);
    const { streakIncreased } = completeLesson(lesson.id, xp, perfect);
    const accuracy = answered === 0 ? 1 : (answered - mistakes) / answered;
    onFinish({ xp, accuracy, perfect, streakIncreased, lessonTitle: lesson.title });
  }

  const progress = pos / queue.length + (status !== 'answering' ? 1 / queue.length : 0);
  const translateY = sheet.interpolate({ inputRange: [0, 1], outputRange: [260, 0] });

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.top}>
        <Pressable onPress={() => setConfirmQuit(true)} hitSlop={12} accessibilityLabel="Lektion schließen">
          <Cross size={28} color="#A0A4B8" />
        </Pressable>
        <ProgressBar value={progress} style={{ flex: 1, marginHorizontal: 14 }} />
        <Heart size={26} />
        <Text style={styles.hearts}>{state.hearts}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {ex.type === 'info' ? (
          <InfoView ex={ex} course={course} />
        ) : (
          <>
            {requeued.has(ex) && pos >= lesson.exercises.length && <Text style={styles.retry}>⟳ NOCHMAL ÜBEN</Text>}
            <Text style={styles.prompt}>{ex.prompt}</Text>
            {ex.type === 'choice' && (
              <ChoiceView ex={ex} course={course} options={choices} value={value} setValue={setValue} status={status} />
            )}
            {ex.type === 'fill' && <FillView ex={ex} course={course} options={choices} value={value} setValue={setValue} status={status} />}
            {ex.type === 'order' && <OrderView ex={ex} course={course} options={choices} value={value} setValue={setValue} status={status} />}
            {ex.hint && status === 'answering' && (
              <Pressable onPress={() => setShowHint((h) => !h)} style={styles.hintBtn}>
                <Bulb size={20} />
                <Text style={styles.hintBtnText}>{showHint ? ex.hint : 'Tipp anzeigen'}</Text>
              </Pressable>
            )}
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          title={ex.type === 'info' ? 'Verstanden!' : 'Überprüfen'}
          onPress={check}
          disabled={!canCheck}
          color={colors.green}
          shade={colors.greenDark}
        />
      </View>

      {status !== 'answering' && (
        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: insets.bottom + 16, backgroundColor: status === 'right' ? colors.greenSoft : colors.redSoft, transform: [{ translateY }] },
          ]}
        >
          <View style={styles.sheetHead}>
            <View style={[styles.badge, { backgroundColor: status === 'right' ? colors.green : colors.red }]}>
              {status === 'right' ? <Check size={22} /> : <Cross size={20} />}
            </View>
            <Text style={[styles.sheetTitle, { color: status === 'right' ? colors.greenDark : colors.redDark }]}>{message}</Text>
          </View>
          {status === 'wrong' && (
            <View style={{ marginBottom: 6 }}>
              <Text style={[styles.sheetLabel, { color: colors.redDark }]}>Richtige Lösung:</Text>
              <Text style={[styles.solution, { color: colors.redDark }]}>{solutionText(ex)}</Text>
            </View>
          )}
          {'explain' in ex && <Text style={[styles.explain, { color: status === 'right' ? colors.greenDark : colors.redDark }]}>{ex.explain}</Text>}
          <Button
            title="Weiter"
            onPress={next}
            color={status === 'right' ? colors.green : colors.red}
            shade={status === 'right' ? colors.greenDark : colors.redDark}
            style={{ marginTop: 14 }}
          />
        </Animated.View>
      )}

      <Modal visible={outOfHearts} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Mascot size={110} mood="sad" />
            <Text style={styles.modalTitle}>Keine Herzen mehr</Text>
            <Text style={styles.modalText}>Fehler sind völlig normal – so lernt man! Bit füllt deine Herzen kostenlos wieder auf. Lies dir die Erklärungen noch einmal in Ruhe durch.</Text>
            <Button
              title="Herzen auffüllen"
              color={colors.red}
              shade={colors.redDark}
              onPress={() => {
                refillHearts();
                setOutOfHearts(false);
                setStatus('answering');
                if (pos + 1 >= queue.length) finish();
                else setPos((p) => p + 1);
              }}
              style={{ alignSelf: 'stretch', marginTop: 8 }}
            />
            <Button title="Lektion beenden" outline onPress={onClose} style={{ alignSelf: 'stretch', marginTop: 10 }} />
          </View>
        </View>
      </Modal>

      <Modal visible={confirmQuit} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Mascot size={100} mood="think" />
            <Text style={styles.modalTitle}>Wirklich aufhören?</Text>
            <Text style={styles.modalText}>Du bist schon so weit gekommen! Dein Fortschritt in dieser Lektion geht verloren.</Text>
            <Button title="Weiterlernen" onPress={() => setConfirmQuit(false)} style={{ alignSelf: 'stretch', marginTop: 8 }} />
            <Button title="Beenden" outline onPress={onClose} style={{ alignSelf: 'stretch', marginTop: 10 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function InfoView({ ex, course }: { ex: Extract<Exercise, { type: 'info' }>; course: Course }) {
  return (
    <View>
      <View style={styles.newTag}>
        <Text style={styles.newTagText}>NEU</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 14 }}>
        <Mascot size={86} mood="wave" />
        <View style={styles.bubble}>
          <Text style={styles.infoTitle}>{ex.title}</Text>
        </View>
      </View>
      <Rich text={ex.text} style={styles.infoText} boldColor={course.colorDark} />
      {ex.code && (
        <View style={{ marginTop: 16 }}>
          <CodeBlock code={ex.code} keywords={course.keywords} lineComment={course.lineComment} />
        </View>
      )}
      {ex.tip && (
        <View style={styles.tip}>
          <Bulb size={22} />
          <Text style={styles.tipText}>{ex.tip}</Text>
        </View>
      )}
    </View>
  );
}

type ViewProps<E> = { ex: E; course: Course; options: string[]; value: any; setValue: (v: any) => void; status: Status };

function optionStyle(selected: boolean, status: Status, isAnswer: boolean, color: string) {
  if (status !== 'answering' && selected) return { borderColor: isAnswer ? colors.green : colors.red, backgroundColor: isAnswer ? colors.greenSoft : colors.redSoft };
  if (selected) return { borderColor: color, backgroundColor: color + '18' };
  return {};
}

function ChoiceView({ ex, course, options, value, setValue, status }: ViewProps<Extract<Exercise, { type: 'choice' }>>) {
  const locked = status !== 'answering';
  return (
    <View>
      {ex.code && (
        <View style={{ marginBottom: 18 }}>
          <CodeBlock code={ex.code} keywords={course.keywords} lineComment={course.lineComment} />
        </View>
      )}
      {options.map((opt, i) => {
        const selected = value === opt;
        const isAnswer = opt === ex.options[ex.answer];
        return (
          <Pressable
            key={opt}
            onPress={() => !locked && setValue(opt)}
            style={[styles.option, optionStyle(selected, status, isAnswer, course.color)]}
          >
            <View style={[styles.optionKey, selected && { borderColor: course.color }]}>
              <Text style={[styles.optionKeyText, selected && { color: course.color }]}>{i + 1}</Text>
            </View>
            <Text style={[styles.optionText, /[(){};"=<>]/.test(opt) && { fontFamily: 'JetBrainsMono_500Medium', fontSize: 15 }]}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function FillView({ ex, course, options, value, setValue, status }: ViewProps<Extract<Exercise, { type: 'fill' }>>) {
  const locked = status !== 'answering';
  return (
    <View>
      <CodeBlock
        code={ex.code}
        keywords={course.keywords}
        lineComment={course.lineComment}
        blank={value}
        blankState={status === 'answering' ? 'idle' : status === 'right' ? 'right' : 'wrong'}
      />
      <Text style={styles.bankLabel}>Tippe auf das passende Stück:</Text>
      <View style={styles.bank}>
        {options.map((opt) => (
          <Chip key={opt} label={opt} used={value === opt} onPress={() => !locked && setValue(value === opt ? null : opt)} />
        ))}
      </View>
    </View>
  );
}

function OrderView({ ex, course, options, value, setValue, status }: ViewProps<Extract<Exercise, { type: 'order' }>>) {
  const locked = status !== 'answering';
  const picked = value as number[];
  const lines = ex.mode === 'lines';
  return (
    <View>
      <View style={[styles.answerArea, lines && { flexDirection: 'column', alignItems: 'stretch' }]}>
        {picked.length === 0 && <Text style={styles.answerHint}>Tippe unten auf die Bausteine …</Text>}
        {picked.map((i) => (
          <Chip key={i} label={options[i]} code onPress={() => !locked && setValue(picked.filter((p) => p !== i))} block={lines} />
        ))}
      </View>
      <View style={[styles.bank, lines && { flexDirection: 'column', alignItems: 'stretch' }]}>
        {options.map((opt, i) => (
          <Chip key={i} label={opt} code used={picked.includes(i)} block={lines} onPress={() => !locked && !picked.includes(i) && setValue([...picked, i])} />
        ))}
      </View>
    </View>
  );
}

function Chip({ label, used, onPress, code, block }: { label: string; used?: boolean; onPress: () => void; code?: boolean; block?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, block && { alignSelf: 'stretch' }, used && styles.chipUsed]}>
      <Text
        style={[
          styles.chipText,
          { fontFamily: code || /[^A-Za-zÄÖÜäöüß ]/.test(label) ? 'JetBrainsMono_500Medium' : font.bold },
          used && { color: 'transparent' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.card },
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingBottom: 8 },
  hearts: { fontFamily: font.black, color: colors.red, fontSize: 18, marginLeft: 4 },
  body: { padding: 20, paddingBottom: 40 },
  retry: { fontFamily: font.black, color: colors.orange, letterSpacing: 1, marginBottom: 6 },
  prompt: { fontFamily: font.black, fontSize: 22, color: colors.text, marginBottom: 18, lineHeight: 29 },
  hintBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18, padding: 12, borderRadius: radius.md, backgroundColor: '#FFF8DB' },
  hintBtnText: { fontFamily: font.bold, color: '#8A6D00', flex: 1, fontSize: 15 },
  footer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 2, borderTopColor: colors.border, backgroundColor: colors.card },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  badge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  sheetTitle: { fontFamily: font.black, fontSize: 22 },
  sheetLabel: { fontFamily: font.black, fontSize: 15 },
  solution: { fontFamily: 'JetBrainsMono_500Medium', fontSize: 15, marginTop: 2 },
  explain: { fontFamily: font.regular, fontSize: 16, lineHeight: 22 },
  newTag: { alignSelf: 'flex-start', backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, marginBottom: 6 },
  newTagText: { fontFamily: font.black, color: '#FFF', fontSize: 12, letterSpacing: 1 },
  bubble: { flex: 1, marginLeft: 6, marginBottom: 30, padding: 14, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.card },
  infoTitle: { fontFamily: font.black, fontSize: 20, color: colors.text },
  infoText: { fontFamily: font.regular, fontSize: 18, lineHeight: 27, color: colors.text },
  tip: { flexDirection: 'row', gap: 10, marginTop: 16, padding: 14, borderRadius: radius.md, backgroundColor: '#FFF8DB', alignItems: 'flex-start' },
  tipText: { fontFamily: font.bold, color: '#6B5500', flex: 1, fontSize: 15, lineHeight: 21 },
  option: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, borderRadius: radius.md, padding: 14, marginBottom: 12, backgroundColor: colors.card },
  optionKey: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  optionKeyText: { fontFamily: font.black, color: colors.textSoft, fontSize: 13 },
  optionText: { fontFamily: font.bold, fontSize: 17, color: colors.text, flex: 1 },
  bankLabel: { fontFamily: font.bold, color: colors.textSoft, marginTop: 20, marginBottom: 10 },
  bank: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 4 },
  answerArea: { minHeight: 70, flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 10, marginBottom: 22, borderRadius: radius.md, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.borderDark, alignItems: 'center' },
  answerHint: { fontFamily: font.bold, color: '#A0A4B8', paddingHorizontal: 6 },
  chip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, backgroundColor: colors.card },
  chipUsed: { backgroundColor: colors.locked, borderColor: colors.locked },
  chipText: { fontSize: 15, color: colors.text },
  modalBg: { flex: 1, backgroundColor: 'rgba(20,20,40,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: colors.card, borderRadius: radius.xl, padding: 24, alignItems: 'center', width: '100%', maxWidth: 380 },
  modalTitle: { fontFamily: font.black, fontSize: 22, color: colors.text, marginTop: 8 },
  modalText: { fontFamily: font.regular, fontSize: 16, color: colors.textSoft, textAlign: 'center', marginVertical: 10, lineHeight: 22 },
});
