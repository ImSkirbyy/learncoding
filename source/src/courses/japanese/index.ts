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

export const japanese: Course = {
  id: 'japanese',
  kind: 'language',
  speech: 'ja-JP',
  name: 'Japanisch',
  tagline: 'Von null an: Begrüßen, Schrift, Essen bestellen, Wege finden',
  difficulty: 2,
  color: '#E11D48',
  colorDark: '#9F1239',
  keywords: [],
  lineComment: '',
  units: [u01, u02, u03, u04, u05, u06, u07, u08, u09, u10, u11],
};
