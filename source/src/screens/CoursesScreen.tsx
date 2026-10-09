import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { courses, flatLessons } from '../courses';
import { colors, font, radius } from '../theme';
import { LangIcon, Check } from '../components/Icons';
import { ProgressBar } from '../components/ui';
import { useProgress } from '../progress';
import { CourseId } from '../types';

const LEVEL = ['', 'Leicht für Einsteiger', 'Mittel', 'Etwas anspruchsvoller'];

export function CourseList({ selected, onSelect, showProgress = true }: { selected: CourseId | null; onSelect: (id: CourseId) => void; showProgress?: boolean }) {
  const { state } = useProgress();
  return (
    <View>
      {courses.map((c) => {
        const ls = flatLessons(c);
        const done = ls.filter((l) => state.completed[l.lesson.id]).length;
        const active = selected === c.id;
        return (
          <Pressable key={c.id} onPress={() => onSelect(c.id)} style={[styles.card, active && { borderColor: c.color, backgroundColor: c.color + '10' }]}>
            <LangIcon id={c.id} size={56} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.name}>{c.name}</Text>
                {c.difficulty === 1 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>IDEAL ZUM START</Text>
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
  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={styles.h1}>Sprachen</Text>
      <Text style={styles.sub}>Wähle, was du lernen willst. Dein Fortschritt bleibt bei jeder Sprache gespeichert.</Text>
      <CourseList selected={state.courseId} onSelect={onPick} />
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
  check: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
});
