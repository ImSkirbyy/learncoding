import React from 'react';
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

export type Mood = 'happy' | 'cheer' | 'sad' | 'think' | 'wave';

/** "Bit" – das Roboter-Maskottchen der App. Komplett selbst gezeichnet. */
export function Mascot({ size = 140, mood = 'happy' }: { size?: number; mood?: Mood }) {
  const glow = '#7CF5C8';
  const armUpLeft = mood === 'cheer';
  const armUpRight = mood === 'cheer' || mood === 'wave';

  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 200 220">
      <Defs>
        <LinearGradient id="head" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#8B7CF6" />
          <Stop offset="1" stopColor="#5B4BD8" />
        </LinearGradient>
        <LinearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6C5CE7" />
          <Stop offset="1" stopColor="#4434B8" />
        </LinearGradient>
      </Defs>

      <Ellipse cx="100" cy="210" rx="52" ry="7" fill="#000" opacity={0.08} />

      {/* Arme */}
      <G stroke="#4434B8" strokeWidth={12} strokeLinecap="round" fill="none">
        {armUpLeft ? <Path d="M64 166 L34 134" /> : <Path d="M64 168 Q44 176 40 192" />}
        {armUpRight ? <Path d="M136 166 L166 134" /> : <Path d="M136 168 Q156 176 160 192" />}
      </G>
      <Circle cx={armUpLeft ? 32 : 40} cy={armUpLeft ? 130 : 195} r={9} fill="#FF9F1C" />
      <Circle cx={armUpRight ? 168 : 160} cy={armUpRight ? 130 : 195} r={9} fill="#FF9F1C" />

      {/* Körper */}
      <Rect x="60" y="146" width="80" height="52" rx="18" fill="url(#body)" />
      <Rect x="74" y="158" width="52" height="28" rx="9" fill="#2A2B47" />
      <Path d="M90 166 L84 172 L90 178 M110 166 L116 172 L110 178 M103 164 L97 180" stroke={glow} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Rect x="72" y="196" width="20" height="12" rx="6" fill="#4434B8" />
      <Rect x="108" y="196" width="20" height="12" rx="6" fill="#4434B8" />

      {/* Antenne */}
      <Line x1="100" y1="42" x2="100" y2="20" stroke="#5B4BD8" strokeWidth={6} strokeLinecap="round" />
      <Circle cx="100" cy="15" r="10" fill="#FF9F1C" />
      <Circle cx="96" cy="11" r="3.5" fill="#FFF" opacity={0.7} />

      {/* Ohren */}
      <Rect x="20" y="76" width="16" height="36" rx="8" fill="#FF9F1C" />
      <Rect x="164" y="76" width="16" height="36" rx="8" fill="#FF9F1C" />

      {/* Kopf */}
      <Rect x="30" y="38" width="140" height="112" rx="42" fill="url(#head)" />
      <Path d="M52 52 Q70 44 92 46" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.35} fill="none" />
      <Rect x="46" y="60" width="108" height="74" rx="28" fill="#1E1F33" />

      <Face mood={mood} glow={glow} />

      <Circle cx="60" cy="118" r="7" fill="#FF7AA8" opacity={0.55} />
      <Circle cx="140" cy="118" r="7" fill="#FF7AA8" opacity={0.55} />
    </Svg>
  );
}

function Face({ mood, glow }: { mood: Mood; glow: string }) {
  const stroke = { stroke: glow, strokeWidth: 5, strokeLinecap: 'round' as const, fill: 'none' };
  switch (mood) {
    case 'cheer':
      return (
        <G>
          <Path d="M68 96 L78 86 L88 96" {...stroke} />
          <Path d="M112 96 L122 86 L132 96" {...stroke} />
          <Path d="M82 108 Q100 126 118 108 Z" fill={glow} />
        </G>
      );
    case 'sad':
      return (
        <G>
          <Ellipse cx="78" cy="96" rx="8" ry="9" fill={glow} />
          <Ellipse cx="122" cy="96" rx="8" ry="9" fill={glow} />
          <Path d="M66 82 L86 86 M134 82 L114 86" {...stroke} strokeWidth={4} />
          <Path d="M88 120 Q100 110 112 120" {...stroke} />
        </G>
      );
    case 'think':
      return (
        <G>
          <Ellipse cx="78" cy="94" rx="8" ry="11" fill={glow} />
          <Path d="M114 96 L130 96" {...stroke} />
          <Path d="M90 116 L110 112" {...stroke} />
        </G>
      );
    default:
      return (
        <G>
          <Ellipse cx="78" cy="94" rx="9" ry="12" fill={glow} />
          <Ellipse cx="122" cy="94" rx="9" ry="12" fill={glow} />
          <Circle cx="81" cy="89" r="3" fill="#FFF" />
          <Circle cx="125" cy="89" r="3" fill="#FFF" />
          <Path d="M86 112 Q100 124 114 112" {...stroke} />
        </G>
      );
  }
}
