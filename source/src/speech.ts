import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

/**
 * Vorlesen mit der eingebauten Stimme des Geräts – kein Internet nötig.
 * Reihenfolge: Android-App (eigene Brücke) → Browser/iPad (Web Speech API) → native Expo-App.
 */

type NativeBridge = { speak: (text: string, lang: string) => void; stop?: () => void };

function bridge(): NativeBridge | null {
  if (typeof window === 'undefined') return null;
  return ((window as any).LearnCodingNative as NativeBridge) ?? null;
}

function synth(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null;
  return (window as any).speechSynthesis ?? null;
}

let voices: SpeechSynthesisVoice[] = [];
function loadVoices() {
  const s = synth();
  if (!s) return;
  voices = s.getVoices();
}
if (Platform.OS === 'web') {
  const s = synth();
  if (s) {
    loadVoices();
    s.addEventListener?.('voiceschanged', loadVoices);
  }
}

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  if (!voices.length) loadVoices();
  const base = lang.slice(0, 2).toLowerCase();
  const matching = voices.filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith(base));
  // Lokale Stimmen bevorzugen (funktionieren offline).
  return matching.find((v) => v.lang.replace('_', '-') === lang && v.localService) ?? matching.find((v) => v.localService) ?? matching[0];
}

export function speak(text: string, lang = 'ja-JP') {
  const b = bridge();
  if (b?.speak) {
    try {
      b.speak(text, lang);
      return;
    } catch {}
  }
  if (Platform.OS === 'web') {
    const s = synth();
    if (!s) return;
    s.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.85;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    s.speak(u);
    return;
  }
  Speech.stop();
  Speech.speak(text, { language: lang, rate: 0.85 });
}

export function stopSpeaking() {
  const b = bridge();
  if (b?.stop) {
    try {
      b.stop();
    } catch {}
  }
  if (Platform.OS === 'web') synth()?.cancel();
  else Speech.stop();
}
