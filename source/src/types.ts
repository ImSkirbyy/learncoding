export type CourseId = 'python' | 'javascript' | 'luau' | 'java' | 'cpp' | 'arduino';

/** Eine Erklär-Karte: bringt etwas Neues bei, ohne Fragen zu stellen. */
export interface InfoExercise {
  type: 'info';
  title: string;
  /** Einfache, kurze Erklärung. **fett** wird hervorgehoben. */
  text: string;
  code?: string;
  tip?: string;
}

/** Multiple Choice. Mit `code` wird oft "Was gibt das aus?" gefragt. */
export interface ChoiceExercise {
  type: 'choice';
  prompt: string;
  code?: string;
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
  code: string;
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
  explain: string;
  hint?: string;
}

export type Exercise = InfoExercise | ChoiceExercise | FillExercise | OrderExercise;

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
