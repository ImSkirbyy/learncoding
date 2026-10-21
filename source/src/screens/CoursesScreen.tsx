import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { courses, flatLessons } from '../courses';
import { colors, font, radius } from '../theme';
import { LangIcon, Check, CodeIcon, ChatIcon } from '../components/Icons';
import { ProgressBar } from '../components/ui';
import { useProgress } from '../progress';
import { CourseId, CourseKind } from '../types';

const LEVEL = ['', 'Leicht für Einsteiger', 'Mittel', 'Etwas anspruchsvoller'];

export const kindOf = (id: CourseId | null): CourseKind => courses.find((c) => c.id === id)?.kind ?? 'code';

/** Umschalter zwischen Programmiersprachen und gesprochenen Sprachen. */
export function KindSwitch({ value, onChange }: { value: CourseKind; onChange: (k: CourseKind) => void }) {
  const items: { k: CourseKind; label: string; Icon: typeof CodeIcon }[] = [
    { k: 'code', label: 'Programmieren', Icon: CodeIcon },
    { k: 'language', label: 'Sprachen', Icon: ChatIcon },
  ];
  return (
    <View style={styles.switch}>
      {items.map(({ k, label, Icon }) => {
        const on = value === k;
        return (
          <Pressable key={k} onPress={() => onChange(k)} style={[styles.switchItem, on && styles.switchOn]} accessibilityRole="tab" accessibilityState={{ selected: on }}>
            <Icon size={18} color={on ? colors.primary : '#A0A4B8'} />
            <Text style={[styles.switchText, on && { color: colors.primary }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function CourseList({ selected, onSelect, showProgress = true, kind }: { selected: CourseId | null; onSelect: (id: CourseId) => void; showProgress?: boolean; kind?: CourseKind }) {
  const { state } = useProgress();
  return (
    <View>
      {courses.filter((c) => !kind || (c.kind ?? 'code') === kind).map((c) => {
        const ls = flatLessons(c);
        const done = ls.filter((l) => state.completed[l.lesson.id]).length;
        const active = selected === c.id;
        return (
          <Pressable key={c.id} onPress={() => onSelect(c.id)} style={[styles.card, active && { borderColor: c.color, backgroundColor: c.color + '10' }]}>
            <LangIcon id={c.id} size={56} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.name}>{c.name}</Text>
                {(c.difficulty === 1 || c.kind === 'language') && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{c.kind === 'language' ? 'AB NULL' : 'IDEAL ZUM START'}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.tag}>{c.tagline}</Text>
              <View style={styles.levelRow}>
                {[1, 2, 3].map((n) => (
                  <View key={n} style={[styles.levelDot, { backgroundColor: n <= c.difficulty ? c.color : colors.locked }]} />
                ))}
                <Text style={styles.levelText}>{LEVEL[c.difficulty]}</Text>
              </View>
              {showProgress && done > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <ProgressBar value={done / ls.length} color={c.color} height={10} style={{ flex: 1 }} />
                  <Text style={styles.levelText}>
                    {done}/{ls.length}
                  </Text>
                </View>
              )}
            </View>
            {active && (
              <View style={[styles.check, { backgroundColor: c.color }]}>
                <Check size={18} />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export function CoursesScreen({ onPick }: { onPick: (id: CourseId) => void }) {
  const { state } = useProgress();
  const [kind, setKind] = useState<CourseKind>(() => kindOf(state.courseId));
  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.h1}>Kurse</Text>
      <Text style={styles.sub}>Wähle, was du lernen willst. Dein Fortschritt bleibt bei jedem Kurs gespeichert.</Text>
      <KindSwitch value={kind} onChange={setKind} />
      <CourseList selected={state.courseId} onSelect={onPick} kind={kind} />
      {kind === 'language' && <Text style={styles.more}>Weitere Sprachen folgen bald.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: font.black, fontSize: 28, color: colors.text, marginTop: 4 },
  sub: { fontFamily: font.regular, fontSize: 15, color: colors.textSoft, marginBottom: 16, marginTop: 4, lineHeight: 21 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 12, borderRadius: radius.lg, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, backgroundColor: colors.card },
  name: { fontFamily: font.black, fontSize: 19, color: colors.text },
  badge: { backgroundColor: colors.greenSoft, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontFamily: font.black, fontSize: 10, color: colors.greenDark, letterSpacing: 0.5 },
  tag: { fontFamily: font.regular, fontSize: 13, color: colors.textSoft, marginTop: 2, lineHeight: 18 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  levelDot: { width: 14, height: 6, borderRadius: 3 },
  levelText: { fontFamily: font.bold, fontSize: 12, color: colors.textSoft, marginLeft: 4 },
  switch: { flexDirection: 'row', backgroundColor: colors.bg, borderRadius: radius.lg, padding: 4, marginBottom: 16, borderWidth: 2, borderColor: colors.border },
  switchItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: radius.md },
  switchOn: { backgroundColor: colors.card, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  switchText: { fontFamily: font.black, fontSize: 15, color: '#A0A4B8' },
  more: { fontFamily: font.bold, fontSize: 14, color: colors.textSoft, textAlign: 'center', marginTop: 6 },
  check: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
});
