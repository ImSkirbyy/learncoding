import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font } from '../theme';
import { Bolt, Flame, GridIcon, Heart, HomeIcon, LangIcon, UserIcon } from './Icons';
import { useProgress } from '../progress';
import { CourseId } from '../types';

export type Tab = 'home' | 'courses' | 'profile';

/** Obere Leiste mit Sprache, Streak, XP und Herzen. */
export function TopBar({ courseId, onCourse }: { courseId: CourseId; onCourse: () => void }) {
  const insets = useSafeAreaInsets();
  const { liveStreak, state } = useProgress();
  return (
    <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={onCourse} hitSlop={8} accessibilityLabel="Sprache wechseln">
        <LangIcon id={courseId} size={34} />
      </Pressable>
      <Stat icon={<Flame size={24} color={liveStreak > 0 ? colors.orange : '#C7CAD6'} />} value={liveStreak} color={liveStreak > 0 ? colors.orange : '#A0A4B8'} />
      <Stat icon={<Bolt size={24} />} value={state.xp} color="#D89E00" />
      <Stat icon={<Heart size={24} />} value={state.hearts} color={colors.red} />
    </View>
  );
}

function Stat({ icon, value, color }: { icon: React.ReactNode; value: number; color: string }) {
  return (
    <View style={styles.stat}>
      {icon}
      <Text style={[styles.statText, { color }]}>{value}</Text>
    </View>
  );
}

export function TabBar({ tab, onTab, accent }: { tab: Tab; onTab: (t: Tab) => void; accent: string }) {
  const insets = useSafeAreaInsets();
  const items: { id: Tab; label: string; Icon: typeof HomeIcon }[] = [
    { id: 'home', label: 'Lernen', Icon: HomeIcon },
    { id: 'courses', label: 'Sprachen', Icon: GridIcon },
    { id: 'profile', label: 'Profil', Icon: UserIcon },
  ];
  return (
    <View style={[styles.tabs, { paddingBottom: insets.bottom + 8 }]}>
      {items.map(({ id, label, Icon }) => {
        const active = tab === id;
        return (
          <Pressable key={id} onPress={() => onTab(id)} style={[styles.tab, active && { backgroundColor: accent + '1A', borderColor: accent + '66' }]}>
            <Icon size={26} color={active ? accent : '#B3B7CC'} />
            <Text style={[styles.tabText, { color: active ? accent : '#9CA0B4' }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 10, backgroundColor: colors.card, borderBottomWidth: 2, borderBottomColor: colors.border },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontFamily: font.black, fontSize: 17 },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8, paddingHorizontal: 10, backgroundColor: colors.card, borderTopWidth: 2, borderTopColor: colors.border },
  tab: { alignItems: 'center', paddingVertical: 6, paddingHorizontal: 18, borderRadius: 14, borderWidth: 2, borderColor: 'transparent' },
  tabText: { fontFamily: font.bold, fontSize: 12, marginTop: 2 },
});
