import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Course } from '../types';
import { flatLessons, LessonRef } from '../courses';
import { colors, font, radius } from '../theme';
import { useProgress } from '../progress';
import { Book, Check, Lock, Star, Trophy, Bolt } from '../components/Icons';
import { Mascot } from '../components/Mascot';
import { Button, ProgressBar } from '../components/ui';

const OFFSETS = [0, 46, 70, 46, 0, -46, -70, -46];

export function HomeScreen({ course, onStart }: { course: Course; onStart: (l: LessonRef) => void }) {
  const { state, todayXp } = useProgress();
  const lessons = flatLessons(course);
  const currentIndex = lessons.findIndex((l) => !state.completed[l.lesson.id]);
  const [selected, setSelected] = useState<LessonRef | null>(null);
  const doneCount = lessons.filter((l) => state.completed[l.lesson.id]).length;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.goal}>
          <View style={{ flex: 1 }}>
            <Text style={styles.goalTitle}>Tagesziel</Text>
            <ProgressBar value={todayXp / state.dailyGoal} color={colors.orange} height={14} style={{ marginTop: 6 }} />
            <Text style={styles.goalText}>
              {todayXp >= state.dailyGoal ? 'Geschafft! Du bist großartig 🎉' : `${todayXp} / ${state.dailyGoal} XP heute`}
            </Text>
          </View>
          <Bolt size={40} />
        </View>

        {course.units.map((unit, ui) => {
          const unitLessons = lessons.filter((l) => l.unitIndex === ui);
          const unitDone = unitLessons.every((l) => state.completed[l.lesson.id]);
          return (
            <View key={unit.id}>
              <View style={[styles.unit, { backgroundColor: course.color, borderBottomColor: course.colorDark }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.unitKicker}>EINHEIT {ui + 1}</Text>
                  <Text style={styles.unitTitle}>{unit.title}</Text>
                  <Text style={styles.unitDesc}>{unit.description}</Text>
                </View>
                <View style={[styles.unitIcon, { backgroundColor: course.colorDark }]}>
                  <Book size={26} />
                </View>
              </View>

              <View style={styles.path}>
                {unitLessons.map((l, k) => {
                  const st = state.completed[l.lesson.id] ? 'done' : l.index === currentIndex ? 'current' : 'locked';
                  return (
                    <View key={l.lesson.id} style={{ transform: [{ translateX: OFFSETS[(l.index) % OFFSETS.length] }], marginBottom: 22 }}>
                      <Node title={l.lesson.title} status={st} course={course} perfect={!!state.perfect[l.lesson.id]} onPress={() => setSelected(l)} />
                    </View>
                  );
                })}
                <View style={[styles.trophy, unitDone && { backgroundColor: '#FFF4C2', borderColor: colors.gold }]}>
                  <Trophy size={34} color={unitDone ? '#E0A800' : '#C7CAD6'} />
                </View>
                <View style={[styles.side, ui % 2 === 0 ? { right: 12 } : { left: 12 }]} pointerEvents="none">
                  <Mascot size={92} mood={unitDone ? 'cheer' : ui % 2 === 0 ? 'happy' : 'think'} />
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            {doneCount === lessons.length ? `Du hast den ${course.name}-Kurs abgeschlossen! 🏆` : `${doneCount} von ${lessons.length} Lektionen geschafft`}
          </Text>
        </View>
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.modalBg} onPress={() => setSelected(null)}>
          {selected && (
            <Pressable style={[styles.pop, { backgroundColor: selected.index <= currentIndex || currentIndex < 0 ? course.color : colors.card }]} onPress={() => {}}>
              {(() => {
                const done = !!state.completed[selected.lesson.id];
                const unlocked = done || selected.index === currentIndex;
                return (
                  <>
                    <Text style={[styles.popTitle, !unlocked && { color: colors.text }]}>{selected.lesson.title}</Text>
                    <Text style={[styles.popSub, !unlocked && { color: colors.textSoft }]}>
                      {unlocked
                        ? `${selected.unit.title} · ${selected.lesson.exercises.length} Aufgaben`
                        : 'Schließe zuerst die Lektionen davor ab, um diese freizuschalten.'}
                    </Text>
                    {unlocked && (
                      <Button
                        title={done ? 'Wiederholen  +5 XP' : 'Starten  +10 XP'}
                        color="#FFF"
                        shade="#E4E6F0"
                        textColor={course.colorDark}
                        onPress={() => {
                          const l = selected;
                          setSelected(null);
                          onStart(l);
                        }}
                        style={{ marginTop: 14 }}
                      />
                    )}
                  </>
                );
              })()}
            </Pressable>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}

function Node({ title, status, course, perfect, onPress }: { title: string; status: 'done' | 'current' | 'locked'; course: Course; perfect: boolean; onPress: () => void }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (status !== 'current') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [status]);

  const fill = status === 'done' ? colors.gold : status === 'current' ? course.color : colors.locked;
  const shade = status === 'done' ? '#E0A800' : status === 'current' ? course.colorDark : colors.lockedDark;
  const bounce = pulse.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  return (
    <View style={{ alignItems: 'center' }}>
      {status === 'current' && (
        <Animated.View style={[styles.startBubble, { transform: [{ translateY: bounce }] }]}>
          <Text style={[styles.startText, { color: course.color }]}>START</Text>
          <View style={styles.startArrow} />
        </Animated.View>
      )}
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Lektion: ${title}`} style={[styles.ring, status === 'current' && { borderColor: course.color + '44' }]}>
        <View style={[styles.nodeShade, { backgroundColor: shade }]}>
          <View style={[styles.node, { backgroundColor: fill }]}>
            {status === 'done' ? <Check size={34} /> : status === 'current' ? <Star size={34} /> : <Lock size={30} />}
          </View>
        </View>
      </Pressable>
      {perfect && <Text style={styles.perfect}>★ PERFEKT</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  goal: { flexDirection: 'row', alignItems: 'center', gap: 14, margin: 16, marginBottom: 4, padding: 16, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 2, borderColor: colors.border },
  goalTitle: { fontFamily: font.black, fontSize: 17, color: colors.text },
  goalText: { fontFamily: font.bold, fontSize: 13, color: colors.textSoft, marginTop: 6 },
  unit: { flexDirection: 'row', alignItems: 'center', margin: 16, marginBottom: 8, padding: 18, borderRadius: radius.lg, borderBottomWidth: 5 },
  unitKicker: { fontFamily: font.black, color: 'rgba(255,255,255,0.8)', fontSize: 12, letterSpacing: 1.5 },
  unitTitle: { fontFamily: font.black, color: '#FFF', fontSize: 22 },
  unitDesc: { fontFamily: font.bold, color: 'rgba(255,255,255,0.92)', fontSize: 14, marginTop: 2 },
  unitIcon: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  path: { alignItems: 'center', paddingVertical: 20 },
  ring: { padding: 6, borderRadius: 60, borderWidth: 5, borderColor: 'transparent' },
  nodeShade: { width: 76, height: 76, borderRadius: 38, paddingBottom: 6 },
  node: { flex: 1, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
  perfect: { fontFamily: font.black, fontSize: 11, color: '#E0A800', marginTop: 2, letterSpacing: 0.8 },
  startBubble: { backgroundColor: colors.card, borderWidth: 2, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, marginBottom: 6, alignItems: 'center' },
  startText: { fontFamily: font.black, fontSize: 15, letterSpacing: 1 },
  startArrow: { position: 'absolute', bottom: -7, width: 12, height: 12, backgroundColor: colors.card, borderRightWidth: 2, borderBottomWidth: 2, borderColor: colors.border, transform: [{ rotate: '45deg' }] },
  trophy: { width: 76, height: 76, borderRadius: 24, borderWidth: 3, borderColor: colors.border, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  side: { position: 'absolute', top: '32%' },
  footerNote: { alignItems: 'center', padding: 20 },
  footerText: { fontFamily: font.bold, color: colors.textSoft, fontSize: 15 },
  modalBg: { flex: 1, backgroundColor: 'rgba(20,20,40,0.45)', justifyContent: 'center', padding: 24 },
  pop: { borderRadius: radius.xl, padding: 22, maxWidth: 420, width: '100%', alignSelf: 'center' },
  popTitle: { fontFamily: font.black, fontSize: 22, color: '#FFF' },
  popSub: { fontFamily: font.bold, fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
});
