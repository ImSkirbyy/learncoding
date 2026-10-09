import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { Nunito_900Black } from '@expo-google-fonts/nunito/900Black';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono/500Medium';
import { ProgressProvider, useProgress } from './src/progress';
import { getCourse, LessonRef } from './src/courses';
import { colors } from './src/theme';
import { Tab, TabBar, TopBar } from './src/components/Chrome';
import { HomeScreen } from './src/screens/HomeScreen';
import { CoursesScreen } from './src/screens/CoursesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { LessonResult, LessonScreen } from './src/screens/LessonScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';

type Route = { name: 'tabs' } | { name: 'lesson'; lesson: LessonRef } | { name: 'result'; result: LessonResult };

function Main() {
  const { state, loaded, selectCourse } = useProgress();
  const [route, setRoute] = useState<Route>({ name: 'tabs' });
  const [tab, setTab] = useState<Tab>('home');

  if (!loaded) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;
  if (!state.onboarded || !state.courseId) return <WelcomeScreen />;

  const course = getCourse(state.courseId);

  if (route.name === 'lesson')
    return (
      <LessonScreen
        key={route.lesson.lesson.id}
        lessonRef={route.lesson}
        onClose={() => setRoute({ name: 'tabs' })}
        onFinish={(result) => setRoute({ name: 'result', result })}
      />
    );
  if (route.name === 'result') return <ResultScreen result={route.result} onContinue={() => setRoute({ name: 'tabs' })} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar courseId={course.id} onCourse={() => setTab('courses')} />
      <View style={{ flex: 1 }}>
        {tab === 'home' && <HomeScreen course={course} onStart={(lesson) => setRoute({ name: 'lesson', lesson })} />}
        {tab === 'courses' && (
          <CoursesScreen
            onPick={(id) => {
              selectCourse(id);
              setTab('home');
            }}
          />
        )}
        {tab === 'profile' && <ProfileScreen />}
      </View>
      <TabBar tab={tab} onTab={setTab} accent={course.color} />
    </View>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ Nunito_600SemiBold, Nunito_800ExtraBold, Nunito_900Black, JetBrainsMono_500Medium });
  // Manche Browser (z. B. Safari auf dem iPad) melden geladene Schriften nie zurück.
  // Dann starten wir nach kurzer Zeit trotzdem – notfalls mit der Systemschrift.
  const [waitedEnough, setWaitedEnough] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWaitedEnough(true), 2500);
    return () => clearTimeout(t);
  }, []);
  const ready = fontsLoaded || !!fontError || waitedEnough;
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.outer}>
        <View style={styles.phone}>
          {ready ? (
            <ProgressProvider>
              <Main />
            </ProgressProvider>
          ) : (
            <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#E9E7F8' : colors.bg, alignItems: 'center' },
  // Im Browser zeigen wir die App in Handy-Breite, auf dem Handy füllt sie den Bildschirm.
  phone: { flex: 1, width: '100%', maxWidth: Platform.OS === 'web' ? 460 : undefined, backgroundColor: colors.bg, overflow: 'hidden' },
});
