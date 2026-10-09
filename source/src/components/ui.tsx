import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors, font, radius } from '../theme';
import { tokenizeLine } from '../highlight';

/** Großer, "drückbarer" 3D-Button im Lern-App-Stil. */
export function Button({
  title,
  onPress,
  color = colors.primary,
  shade = colors.primaryDark,
  textColor = '#FFF',
  disabled,
  outline,
  style,
  small,
}: {
  title: string;
  onPress?: () => void;
  color?: string;
  shade?: string;
  textColor?: string;
  disabled?: boolean;
  outline?: boolean;
  style?: ViewStyle;
  small?: boolean;
}) {
  const [down, setDown] = useState(false);
  const bg = disabled ? colors.locked : outline ? colors.card : color;
  const sh = disabled ? colors.lockedDark : outline ? colors.border : shade;
  const depth = small ? 4 : 5;
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={() => setDown(true)}
      onPressOut={() => setDown(false)}
      accessibilityRole="button"
      style={[{ borderRadius: radius.md, backgroundColor: sh, paddingBottom: down && !disabled ? 1 : depth, marginTop: down && !disabled ? depth - 1 : 0 }, style]}
    >
      <View
        style={{
          backgroundColor: bg,
          borderRadius: radius.md,
          paddingVertical: small ? 10 : 15,
          paddingHorizontal: 18,
          alignItems: 'center',
          borderWidth: outline ? 2 : 0,
          borderColor: colors.border,
        }}
      >
        <Text style={{ fontFamily: font.bold, fontSize: small ? 14 : 16, letterSpacing: 0.8, color: disabled ? '#9CA0B4' : outline ? colors.textSoft : textColor, textTransform: 'uppercase' }}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

export function ProgressBar({ value, color = colors.green, height = 16, style }: { value: number; color?: string; height?: number; style?: ViewStyle }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={[{ height, borderRadius: height, backgroundColor: colors.locked, overflow: 'hidden' }, style]}>
      <View style={{ width: `${pct * 100}%`, height: '100%', borderRadius: height, backgroundColor: color }}>
        <View style={{ position: 'absolute', top: height * 0.22, left: 8, right: 8, height: height * 0.22, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.35)' }} />
      </View>
    </View>
  );
}

/** Text mit **fett** markierten Stellen. */
export function Rich({ text, style, boldColor }: { text: string; style?: TextStyle; boldColor?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*\*\*\*\*)/g);
  return (
    <Text style={style}>
      {parts.map((p, i) => {
        if (p === '*****') return <Text key={i} style={{ fontFamily: font.black, color: boldColor }}>*</Text>;
        if (p.startsWith('**') && p.endsWith('**') && p.length > 4)
          return (
            <Text key={i} style={{ fontFamily: font.black, color: boldColor }}>
              {p.slice(2, -2)}
            </Text>
          );
        return <Text key={i}>{p}</Text>;
      })}
    </Text>
  );
}

/** Code mit Syntax-Farben. `___` wird als Lücke (oder als gewählte Antwort) gezeigt. */
export function CodeBlock({
  code,
  keywords,
  lineComment,
  blank,
  blankState,
  fontSize = 15,
}: {
  code: string;
  keywords: string[];
  lineComment: string;
  blank?: string | null;
  blankState?: 'idle' | 'right' | 'wrong';
  fontSize?: number;
}) {
  const lines = code.split('\n');
  const blankColor = blankState === 'right' ? colors.green : blankState === 'wrong' ? colors.red : '#8B7CF6';
  return (
    <View style={styles.code}>
      <View style={styles.dots}>
        <View style={[styles.dot, { backgroundColor: '#FF5F57' }]} />
        <View style={[styles.dot, { backgroundColor: '#FEBC2E' }]} />
        <View style={[styles.dot, { backgroundColor: '#28C840' }]} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
        <View>
          {lines.map((line, i) => {
            const segs = line.split('___');
            return (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', minHeight: fontSize * 1.65 }}>
                <Text style={[styles.lineNo, { fontSize: fontSize - 3 }]}>{i + 1}</Text>
                {segs.map((seg, j) => (
                  <React.Fragment key={j}>
                    <Text style={{ fontFamily: font.mono, fontSize }}>
                      {tokenizeLine(seg, keywords, lineComment).map((t, k) => (
                        <Text key={k} style={{ color: t.color }}>
                          {t.text}
                        </Text>
                      ))}
                    </Text>
                    {j < segs.length - 1 && (
                      <View style={[styles.blank, { borderColor: blankColor, backgroundColor: blank ? blankColor : 'transparent' }]}>
                        <Text style={{ fontFamily: font.mono, fontSize, color: blank ? '#FFF' : 'transparent' }}>{blank || '????'}</Text>
                      </View>
                    )}
                  </React.Fragment>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  code: { backgroundColor: colors.codeBg, borderRadius: radius.md, padding: 14, paddingTop: 12 },
  dots: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  lineNo: { fontFamily: font.mono, color: '#4F5376', width: 22 },
  blank: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 8, paddingHorizontal: 6, marginHorizontal: 2, minWidth: 44, alignItems: 'center' },
});
