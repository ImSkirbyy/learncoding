import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius } from '../theme';
import { Mascot } from '../components/Mascot';
import { Bolt, Flame, Trophy, Book, Star, LangIcon } from '../components/Icons';
import { Button } from '../components/ui';
import { useProgress, dayKey } from '../progress';
import { courses, flatLessons } from '../courses';

const WEEK = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export function ProfileScreen() {
  const { state, liveStreak, setDailyGoal, reset } = useProgress();
  const [confirm, setConfirm] = useState(false);
  const lessonsDone = Object.keys(state.completed).length;
  const perfectCount = Object.keys(state.perfect).length;
  const started = courses.filter((c) => flatLessons(c).some((l) => state.completed[l.lesson.id]));

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { label: WEEK[d.getDay()], xp: state.dailyXp[dayKey(d)] ?? 0, today: i === 6 };
  });
  const maxXp = Math.max(state.dailyGoal, ...days.map((d) => d.xp));

  const achievements = [
    { title: 'Erste Schritte', desc: 'Schließe deine erste Lektion ab', done: lessonsDone >= 1, Icon: Star },
    { title: 'Fleißig', desc: 'Schließe 10 Lektionen ab', done: lessonsDone >= 10, Icon: Book },
    { title: 'Feuer & Flamme', desc: 'Erreiche einen 3-Tage-Streak', done: state.bestStreak >= 3, Icon: Flame },
    { title: 'Fehlerfrei', desc: '5 perfekte Lektionen', done: perfectCount >= 5, Icon: Trophy },
    { title: 'Polyglott', desc: 'Starte 3 verschiedene Kurse', done: started.length >= 3, Icon: Bolt },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={styles.head}>
        <View style={styles.avatar}>
          <Mascot size={96} mood="happy" />
        </View>
        <Text style={styles.name}>Dein Profil</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
          {started.map((c) => (
            <LangIcon key={c.id} id={c.id} size={28} />
          ))}
        </View>
      </View>

      <Text style={styles.h2}>Statistik</Text>
      <View style={styles.grid}>
        <StatCard icon={<Flame size={26} />} value={liveStreak} label="Tage-Streak" />
        <StatCard icon={<Bolt size={26} />} value={state.xp} label="XP gesamt" />
        <StatCard icon={<Book size={26} color={colors.primary} />} value={lessonsDone} label="Lektionen" />
        <StatCard icon={<Trophy size={26} />} value={state.bestStreak} label="Bester Streak" />
      </View>

      <Text style={styles.h2}>Diese Woche</Text>
      <View style={styles.card}>
        <View style={styles.chart}>
          {days.map((d, i) => (
            <View key={i} style={styles.barCol}>
              <Text style={styles.barVal}>{d.xp || ''}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.bar, { height: `${(d.xp / maxXp) * 100}%`, backgroundColor: d.xp >= state.dailyGoal ? colors.orange : colors.primary }]} />
              </View>
              <Text style={[styles.barLabel, d.today && { color: colors.text }]}>{d.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.h2}>Tagesziel</Text>
      <View style={styles.goals}>
        {[20, 30, 50, 80].map((g) => (
          <Pressable key={g} onPress={() => setDailyGoal(g)} style={[styles.goal, state.dailyGoal === g && styles.goalActive]}>
            <Text style={[styles.goalText, state.dailyGoal === g && { color: colors.primary }]}>{g} XP</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.h2}>Erfolge</Text>
      <View style={styles.card}>
        {achievements.map(({ title, desc, done, Icon }, i) => (
          <View key={title} style={[styles.ach, i > 0 && { borderTopWidth: 2, borderTopColor: colors.border }]}>
            <View style={[styles.achIcon, { backgroundColor: done ? '#FFF4C2' : colors.locked }]}>
              <Icon size={26} color={done ? '#E0A800' : '#B3B7CC'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.achTitle}>{title}</Text>
              <Text style={styles.achDesc}>{desc}</Text>
            </View>
            {done && <Text style={styles.achDone}>✓</Text>}
          </View>
        ))}
      </View>

      <View style={{ marginTop: 28 }}>
        {confirm ? (
          <>
            <Text style={styles.warn}>Wirklich alles zurücksetzen? Das kann nicht rückgängig gemacht werden.</Text>
            <Button title="Ja, zurücksetzen" color={colors.red} shade={colors.redDark} onPress={reset} />
            <Button title="Abbrechen" outline onPress={() => setConfirm(false)} style={{ marginTop: 10 }} />
          </>
        ) : (
          <Button title="Fortschritt zurücksetzen" outline onPress={() => setConfirm(true)} />
        )}
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <View style={styles.stat}>
      {icon}
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.statVal}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', paddingVertical: 10 },
  avatar: { width: 130, height: 130, borderRadius: 65, backgroundColor: '#EEEBFF', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  name: { fontFamily: font.black, fontSize: 24, color: colors.text, marginTop: 10 },
  h2: { fontFamily: font.black, fontSize: 20, color: colors.text, marginTop: 22, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { flexBasis: '47%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.card },
  statVal: { fontFamily: font.black, fontSize: 20, color: colors.text },
  statLabel: { fontFamily: font.bold, fontSize: 12, color: colors.textSoft },
  card: { borderRadius: radius.lg, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.card, padding: 14 },
  chart: { flexDirection: 'row', height: 150, alignItems: 'flex-end', justifyContent: 'space-between' },
  barCol: { flex: 1, alignItems: 'center', height: '100%' },
  barVal: { fontFamily: font.bold, fontSize: 11, color: colors.textSoft, height: 16 },
  barTrack: { flex: 1, width: 20, justifyContent: 'flex-end', backgroundColor: colors.bg, borderRadius: 8, overflow: 'hidden' },
  bar: { width: '100%', borderRadius: 8 },
  barLabel: { fontFamily: font.black, fontSize: 12, color: colors.textSoft, marginTop: 6 },
  goals: { flexDirection: 'row', gap: 8 },
  goal: { flex: 1, paddingVertical: 12, borderRadius: radius.md, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.card },
  goalActive: { borderColor: colors.primary, backgroundColor: '#F1EEFF' },
  goalText: { fontFamily: font.black, color: colors.textSoft },
  ach: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  achIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  achTitle: { fontFamily: font.black, fontSize: 16, color: colors.text },
  achDesc: { fontFamily: font.bold, fontSize: 13, color: colors.textSoft },
  achDone: { fontFamily: font.black, fontSize: 20, color: colors.green },
  warn: { fontFamily: font.bold, color: colors.redDark, textAlign: 'center', marginBottom: 10 },
});
