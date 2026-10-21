export type CourseId = 'python' | 'javascript' | 'luau' | 'java' | 'cpp' | 'arduino' | 'japanese';

/** Programmiersprache oder gesprochene Sprache – steuert den Umschalter und die Darstellung. */
export type CourseKind = 'code' | 'language';

/** Ein Beispiel in einem Sprachkurs: Originaltext, Aussprache-Hilfe und Übersetzung. */
export interface Phrase {
  /** Text in der Zielsprache (z. B. こんにちは). Wird vorgelesen. */
  jp: string;
  /** Lautschrift (Rōmaji), z. B. konnichiwa */
  romaji: string;
  /** Deutsche Bedeutung */
  de: string;
}

/** Eine Erklär-Karte: bringt etwas Neues bei, ohne Fragen zu stellen. */
export interface InfoExercise {
  type: 'info';
  title: string;
  /** Einfache, kurze Erklärung. **fett** wird hervorgehoben. */
  text: string;
  code?: string;
  tip?: string;
  /** Sprachkurse: Beispiele mit Vorlese-Knopf. */
  examples?: Phrase[];
}

/** Multiple Choice. Mit `code` wird oft "Was gibt das aus?" gefragt. */
export interface ChoiceExercise {
  type: 'choice';
  prompt: string;
  code?: string;
  /** Sprachkurse: großer Text in der Zielsprache über den Antworten (mit Vorlese-Knopf). */
  big?: string;
  /** Lautschrift unter `big` (weglassen, wenn genau die Aussprache abgefragt wird). */
  romaji?: string;
  /** Hör-Aufgabe: `big` wird nur vorgelesen, nicht angezeigt. */
  listen?: boolean;
  /** Antworten sind in der Zielsprache und bekommen einen Vorlese-Knopf. */
  speakOptions?: boolean;
  options: string[];
  /** Index der richtigen Antwort in `options`. */
  answer: number;
  explain: string;
  hint?: string;
}

/** Lückentext: `code` enthält genau einmal `___`. */
export interface FillExercise {
  type: 'fill';
  prompt: string;
  /** Code bzw. in Sprachkursen ein Satz – enthält genau einmal `___`. */
  code: string;
  /** Sprachkurse: Übersetzung des Satzes als Hilfe. */
  hint_de?: string;
  options: string[];
  /** Muss genau einem Eintrag in `options` entsprechen. */
  answer: string;
  explain: string;
  hint?: string;
}

/** Bausteine in die richtige Reihenfolge bringen. */
export interface OrderExercise {
  type: 'order';
  prompt: string;
  /** Teile in der RICHTIGEN Reihenfolge – die App mischt sie. */
  parts: string[];
  /** Falsche Extra-Bausteine (optional). */
  distractors?: string[];
  /** 'lines' = jede Zeile ein Baustein, 'tokens' = Wörter einer Zeile. */
  mode: 'lines' | 'tokens';
  /** Sprachkurse: Satz, der übersetzt werden soll (wird oben angezeigt). */
  source?: string;
  /** Wird `source` vorgelesen? (nur wenn es Zielsprache ist) */
  speakSource?: boolean;
  /** Bausteine sind Zielsprache: Vorlesen beim Antippen. */
  speakParts?: boolean;
  /** Trennzeichen beim Anzeigen der Lösung (Japanisch: ''). Standard: Leerzeichen bzw. Zeilenumbruch. */
  joiner?: string;
  explain: string;
  hint?: string;
}

/** Paare finden: links und rechts antippen, die zusammengehören. */
export interface MatchExercise {
  type: 'match';
  prompt: string;
  /** [links, rechts] – z. B. ['あ', 'a'] oder ['みず', 'Wasser']. 3 bis 5 Paare. */
  pairs: [string, string][];
  /** Linke Seite vorlesen, wenn angetippt (Zielsprache). */
  speakLeft?: boolean;
  explain?: string;
}

export type Exercise = InfoExercise | ChoiceExercise | FillExercise | OrderExercise | MatchExercise;

export interface Lesson {
  id: string;
  title: string;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: CourseId;
  /** Standard: 'code' */
  kind?: CourseKind;
  /** Sprachkurse: Stimme für das Vorlesen, z. B. 'ja-JP'. */
  speech?: string;
  name: string;
  /** Ein Satz, wofür die Sprache genutzt wird. */
  tagline: string;
  difficulty: 1 | 2 | 3;
  color: string;
  colorDark: string;
  /** Für die Syntax-Hervorhebung. */
  keywords: string[];
  lineComment: string;
  units: Unit[];
}
