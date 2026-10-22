import { Course } from '../../types';
import { u01 } from './u01-begruessen';
import { u02 } from './u02-hiragana';
import { u03 } from './u03-vorstellen';
import { u04 } from './u04-katakana';
import { u05 } from './u05-zahlen';
import { u06 } from './u06-essen';
import { u07 } from './u07-unterwegs';
import { u08 } from './u08-zeit';
import { u09 } from './u09-menschen';
import { u10 } from './u10-einkaufen';
import { u11 } from './u11-kanji';

// Lektions-IDs (jp-uN-lM) bleiben unverändert, auch wenn Einheiten den Kurs wechseln – sonst ginge Fortschritt verloren.

/** Japanisch sprechen – komplett in Lautschrift (normale Buchstaben). */
export const japanese: Course = {
  id: 'japanese',
  kind: 'language',
  speech: 'ja-JP',
  script: 'romaji',
  name: 'Japanisch',
  tagline: 'Von null an mit normalen Buchstaben: Begrüßen, Essen bestellen, Wege finden',
  difficulty: 2,
  color: '#E11D48',
  colorDark: '#9F1239',
  keywords: [],
  lineComment: '',
  units: [u01, u03, u05, u06, u07, u08, u09, u10],
};

/** Die japanischen Schriftzeichen – separat und freiwillig. */
export const kana: Course = {
  id: 'kana',
  kind: 'language',
  speech: 'ja-JP',
  script: 'native',
  name: 'Japanische Schrift',
  tagline: 'Hiragana, Katakana und erste Kanji – Zeichen für Zeichen',
  difficulty: 2,
  color: '#0EA5E9',
  colorDark: '#0369A1',
  keywords: [],
  lineComment: '',
  units: [u02, u04, u11],
};
