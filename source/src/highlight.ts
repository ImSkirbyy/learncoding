import { syntax, colors } from './theme';

export interface Token {
  text: string;
  color: string;
}

const PUNCT = /^[(){}\[\];:,.<>=+\-*/!~#&|%]+/;

/** Sehr einfache Syntax-Hervorhebung: reicht für kurze Lern-Beispiele. */
export function tokenizeLine(line: string, keywords: string[], lineComment: string): Token[] {
  const out: Token[] = [];
  let rest = line;
  const push = (text: string, color: string) => {
    if (!text) return;
    const last = out[out.length - 1];
    if (last && last.color === color) last.text += text;
    else out.push({ text, color });
  };
  while (rest.length) {
    if (lineComment && rest.startsWith(lineComment) && !(lineComment === '#' && rest.startsWith('#include'))) {
      push(rest, syntax.comment);
      break;
    }
    const str = rest.match(/^("([^"\\]|\\.)*"?|'([^'\\]|\\.)*'?|`[^`]*`?)/);
    if (str) {
      push(str[0], syntax.string);
      rest = rest.slice(str[0].length);
      continue;
    }
    const num = rest.match(/^\d+(\.\d+)?/);
    if (num) {
      push(num[0], syntax.number);
      rest = rest.slice(num[0].length);
      continue;
    }
    const word = rest.match(/^#?[A-Za-z_][A-Za-z0-9_]*/);
    if (word) {
      const w = word[0];
      push(w, keywords.includes(w) || w.startsWith('#') ? syntax.keyword : colors.codeText);
      rest = rest.slice(w.length);
      continue;
    }
    if (rest.startsWith('___')) {
      push('___', colors.codeText);
      rest = rest.slice(3);
      continue;
    }
    const p = rest.match(PUNCT);
    if (p) {
      push(p[0], syntax.punct);
      rest = rest.slice(p[0].length);
      continue;
    }
    push(rest[0], colors.codeText);
    rest = rest.slice(1);
  }
  return out;
}
