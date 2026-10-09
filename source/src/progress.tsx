import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseId } from './types';

export const MAX_HEARTS = 5;
const KEY = 'learncoding-progress-v1';

export interface ProgressState {
  onboarded: boolean;
  courseId: CourseId | null;
  /** lessonId -> wie oft abgeschlossen */
  completed: Record<string, number>;
  /** lessonId -> ohne Fehler geschafft */
  perfect: Record<string, boolean>;
  xp: number;
  streak: number;
  bestStreak: number;
  lastDay: string | null;
  hearts: number;
  heartsDay: string | null;
  /** 'YYYY-MM-DD' -> XP an diesem Tag */
  dailyXp: Record<string, number>;
  dailyGoal: number;
}

const initial: ProgressState = {
  onboarded: false,
  courseId: null,
  completed: {},
  perfect: {},
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastDay: null,
  hearts: MAX_HEARTS,
  heartsDay: null,
  dailyXp: {},
  dailyGoal: 30,
};

export function dayKey(d = new Date()): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}

interface Ctx {
  state: ProgressState;
  loaded: boolean;
  /** Streak, der heute angezeigt wird (0, wenn ein Tag verpasst wurde). */
  liveStreak: number;
  todayXp: number;
  finishOnboarding: (courseId: CourseId, dailyGoal: number) => void;
  selectCourse: (id: CourseId) => void;
  completeLesson: (lessonId: string, xp: number, perfect: boolean) => { streakIncreased: boolean };
  loseHeart: () => void;
  refillHearts: () => void;
  setDailyGoal: (goal: number) => void;
  reset: () => void;
}

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Falls der Speicher nicht antwortet, nicht ewig warten.
        const raw = await Promise.race([
          AsyncStorage.getItem(KEY),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
        ]);
        if (raw) setState({ ...initial, ...JSON.parse(raw) });
      } catch {
        // Ohne Speicher starten wir einfach frisch.
      }
      setLoaded(true);
    })();
  }, []);

  // Herzen füllen sich jeden Tag wieder auf.
  useEffect(() => {
    if (!loaded) return;
    const today = dayKey();
    if (state.heartsDay !== today) setState((s) => ({ ...s, hearts: MAX_HEARTS, heartsDay: today }));
  }, [loaded, state.heartsDay]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, loaded]);

  const finishOnboarding = useCallback((courseId: CourseId, dailyGoal: number) => {
    setState((s) => ({ ...s, onboarded: true, courseId, dailyGoal }));
  }, []);

  const selectCourse = useCallback((id: CourseId) => setState((s) => ({ ...s, courseId: id })), []);

  const completeLesson = useCallback((lessonId: string, xp: number, perfect: boolean) => {
    const today = dayKey();
    const streakIncreased = state.lastDay !== today;
    setState((s) => {
      let streak = s.streak;
      if (s.lastDay !== today) streak = s.lastDay === yesterdayKey() ? s.streak + 1 : 1;
      return {
        ...s,
        completed: { ...s.completed, [lessonId]: (s.completed[lessonId] ?? 0) + 1 },
        perfect: perfect ? { ...s.perfect, [lessonId]: true } : s.perfect,
        xp: s.xp + xp,
        streak,
        bestStreak: Math.max(s.bestStreak, streak),
        lastDay: today,
        dailyXp: { ...s.dailyXp, [today]: (s.dailyXp[today] ?? 0) + xp },
      };
    });
    return { streakIncreased };
  }, [state.lastDay]);

  const loseHeart = useCallback(() => setState((s) => ({ ...s, hearts: Math.max(0, s.hearts - 1) })), []);
  const refillHearts = useCallback(() => setState((s) => ({ ...s, hearts: MAX_HEARTS })), []);
  const setDailyGoal = useCallback((goal: number) => setState((s) => ({ ...s, dailyGoal: goal })), []);
  const reset = useCallback(() => setState({ ...initial, heartsDay: dayKey() }), []);

  const value = useMemo<Ctx>(() => {
    const today = dayKey();
    const alive = state.lastDay === today || state.lastDay === yesterdayKey();
    return {
      state,
      loaded,
      liveStreak: alive ? state.streak : 0,
      todayXp: state.dailyXp[today] ?? 0,
      finishOnboarding,
      selectCourse,
      completeLesson,
      loseHeart,
      refillHearts,
      setDailyGoal,
      reset,
    };
  }, [state, loaded, finishOnboarding, selectCourse, completeLesson, loseHeart, refillHearts, setDailyGoal, reset]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): Ctx {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress außerhalb von ProgressProvider');
  return ctx;
}
