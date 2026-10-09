import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Rect } from 'react-native-svg';
import { colors, font, radius } from '../theme';
import { Mascot } from '../components/Mascot';
import { Button } from '../components/ui';
import { Bolt, Flame, Star } from '../components/Icons';
import { LessonResult } from './LessonScreen';
import { useProgress } from '../progress';

/** Selbst gezeichnetes Konfetti. */
function Confetti() {
  const pieces = Array.from({ length: 26 }, (_, i) => ({
    x: (i * 37) % 100,
    y: (i * 53) % 60,
    c: ['#6C5CE7', '#22C55E', '#FACC15', '#FF9F1C', '#EC4899', '#3B82F6'][i % 6],
    r: (i * 47) % 360,
    round: i % 3 === 0,
  }));
  return (
    <Svg width="100%" height={220} viewBox="0 0 100 60" preserveAspectRatio="none" style={StyleSheet.absoluteFill as any}>
      {pieces.map((p, i) =>
        p.round ? (
          <Circle key={i} cx={p.x} cy={p.y} r={1} fill={p.c} />
        ) : (
          <Rect key={i} x={p.x} y={p.y} width={2.2} height={1} fill={p.c} rotation={p.r} origin={`${p.x}, ${p.y}`} />
        ),
      )}
    </Svg>
  );
}

export function ResultScreen({ result, onContinue }: { result: LessonResult; onContinue: () => void }) {
  const insets = useSafeAreaInsets();
  const { liveStreak } = useProgress();
  const pop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 5, useNativeDriver: Platform.OS !== 'web' }).start();
  }, []);
  const scale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <View style={[styles.root, { paddingTop: insets.top + 30, paddingBottom: insets.bottom + 24 }]}>
      <Confetti />
      <View style={styles.center}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Mascot size={180} mood="cheer" />
        </Animated.View>
        <Text style={styles.title}>{result.perfect ? 'Perfekte Lektion!' : 'Lektion geschafft!'}</Text>
        <Text style={styles.sub}>„{result.lessonTitle}“ – du wirst immer besser!</Text>

        <View style={styles.tiles}>
          <Tile label="XP" value={`+${result.xp}`} color="#E0A800" icon={<Bolt size={22} />} />
          <Tile label="Treffer" value={`${Math.round(result.accuracy * 100)}%`} color={colors.green} icon={<Star size={22} color={colors.green} />} />
          <Tile label="Streak" value={`${liveStreak}`} color={colors.orange} icon={<Flame size={22} />} />
        </View>
        {result.streakIncreased && (
          <View style={styles.streak}>
            <Flame size={28} />
            <Text style={styles.streakText}>
              {liveStreak === 1 ? 'Dein Streak beginnt! Komm morgen wieder.' : `${liveStreak} Tage in Folge – weiter so!`}
            </Text>
          </View>
        )}
      </View>
      <Button title="Weiter" onPress={onContinue} color={colors.green} shade={colors.greenDark} />
    </View>
  );
}

function Tile({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <View style={[styles.tile, { borderColor: color, backgroundColor: color }]}>
      <Text style={styles.tileLabel}>{label}</Text>
      <View style={styles.tileInner}>
        {icon}
        <Text style={[styles.tileValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.card, paddingHorizontal: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: font.black, fontSize: 30, color: colors.text, marginTop: 14, textAlign: 'center' },
  sub: { fontFamily: font.bold, fontSize: 16, color: colors.textSoft, marginTop: 6, textAlign: 'center' },
  tiles: { flexDirection: 'row', gap: 10, marginTop: 28 },
  tile: { flex: 1, borderRadius: radius.md, borderWidth: 2, overflow: 'hidden', maxWidth: 120 },
  tileLabel: { fontFamily: font.black, color: '#FFF', fontSize: 12, textAlign: 'center', paddingVertical: 4, letterSpacing: 0.5 },
  tileInner: { backgroundColor: colors.card, borderRadius: radius.md - 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 12 },
  tileValue: { fontFamily: font.black, fontSize: 20 },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 22, backgroundColor: '#FFF1DC', padding: 12, borderRadius: radius.md },
  streakText: { fontFamily: font.bold, color: '#B35F00', fontSize: 15, flexShrink: 1 },
});
