import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, radius } from '../theme';
import { Mascot } from '../components/Mascot';
import { Button, ProgressBar } from '../components/ui';
import { CourseList } from './CoursesScreen';
import { CourseId } from '../types';
import { useProgress } from '../progress';

const GOALS = [
  { xp: 20, label: 'Locker', sub: 'ca. 5 Min. am Tag' },
  { xp: 30, label: 'Normal', sub: 'ca. 10 Min. am Tag' },
  { xp: 50, label: 'Ernsthaft', sub: 'ca. 15 Min. am Tag' },
  { xp: 80, label: 'Intensiv', sub: 'ca. 20 Min. am Tag' },
];

export function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { finishOnboarding } = useProgress();
  const [step, setStep] = useState(0);
  const [course, setCourse] = useState<CourseId | null>(null);
  const [goal, setGoal] = useState(30);

  if (step === 0) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.hero}>
          <View style={styles.glow}>
            <Mascot size={190} mood="wave" />
          </View>
          <Text style={styles.brand}>LearnCoding</Text>
          <Text style={styles.lead}>Hi, ich bin Bit! Ich bringe dir Programmieren bei – in kleinen Häppchen, ganz ohne Vorwissen.</Text>
          <View style={styles.pills}>
            {['6 Sprachen', 'Kurze Lektionen', 'Für Anfänger'].map((t) => (
              <View key={t} style={styles.pill}>
                <Text style={styles.pillText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
        <Button title="Los geht's" onPress={() => setStep(1)} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.stepTop}>
        <Pressable onPress={() => setStep(step - 1)} hitSlop={12}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <ProgressBar value={step / 2} style={{ flex: 1, marginLeft: 12 }} />
      </View>
      <View style={styles.ask}>
        <Mascot size={78} mood={step === 1 ? 'happy' : 'think'} />
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{step === 1 ? 'Welche Sprache möchtest du lernen?' : 'Wie viel Zeit möchtest du täglich üben?'}</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }}>
        {step === 1 ? (
          <>
            <CourseList selected={course} onSelect={setCourse} showProgress={false} />
            <Text style={styles.note}>Unsicher? Starte mit Python oder Luau – die sind besonders leicht. Du kannst jederzeit wechseln.</Text>
          </>
        ) : (
          GOALS.map((g) => (
            <Pressable key={g.xp} onPress={() => setGoal(g.xp)} style={[styles.goal, goal === g.xp && styles.goalActive]}>
              <Text style={styles.goalLabel}>{g.label}</Text>
              <Text style={styles.goalSub}>{g.sub}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
      <Button
        title={step === 1 ? 'Weiter' : 'Fertig'}
        disabled={step === 1 && !course}
        onPress={() => (step === 1 ? setStep(2) : course && finishOnboarding(course, goal))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.card, paddingHorizontal: 20 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  glow: { width: 270, height: 270, borderRadius: 135, backgroundColor: '#EEEBFF', alignItems: 'center', justifyContent: 'center' },
  brand: { fontFamily: font.black, fontSize: 38, color: colors.primary, marginTop: 14, letterSpacing: -0.5 },
  lead: { fontFamily: font.bold, fontSize: 18, color: colors.textSoft, textAlign: 'center', marginTop: 10, lineHeight: 26, maxWidth: 340 },
  pills: { flexDirection: 'row', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' },
  pill: { backgroundColor: colors.bg, borderWidth: 2, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  pillText: { fontFamily: font.bold, color: colors.text, fontSize: 13 },
  stepTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  back: { fontFamily: font.black, fontSize: 44, color: '#A0A4B8', lineHeight: 44, paddingHorizontal: 4 },
  ask: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  bubble: { flex: 1, marginLeft: 8, padding: 14, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border },
  bubbleText: { fontFamily: font.black, fontSize: 17, color: colors.text },
  note: { fontFamily: font.bold, color: colors.textSoft, textAlign: 'center', marginTop: 6, paddingHorizontal: 10, lineHeight: 20 },
  goal: { padding: 18, marginBottom: 12, borderRadius: radius.lg, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalActive: { borderColor: colors.primary, backgroundColor: '#F1EEFF' },
  goalLabel: { fontFamily: font.black, fontSize: 18, color: colors.text },
  goalSub: { fontFamily: font.bold, fontSize: 14, color: colors.textSoft },
});
