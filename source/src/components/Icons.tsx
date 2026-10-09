import React from 'react';
import Svg, { Circle, Path, Rect, G, Text as SvgText } from 'react-native-svg';
import { CourseId } from '../types';

type P = { size?: number; color?: string };

export const Flame = ({ size = 24, color = '#FF9F1C' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 1.5-5 3-6 0 2 1 3 2 3-1-3 0-7 1-9z" fill={color} />
    <Path d="M12 13c.6 2 3 2.6 3 5a3 3 0 0 1-6 0c0-1.6 1-2.5 2-3 0 1 .5 1.4 1 1.4-.4-1.4-.4-2.4 0-3.4z" fill="#FFE08A" />
  </Svg>
);

export const Heart = ({ size = 24, color = '#EF4444' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z" fill={color} />
    <Path d="M7.5 7.5a2.4 2.4 0 0 1 2.5-1" stroke="#FFF" strokeWidth={1.6} strokeLinecap="round" opacity={0.6} fill="none" />
  </Svg>
);

export const Bolt = ({ size = 24, color = '#FACC15' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.5z" fill={color} stroke="#E0A800" strokeWidth={1} strokeLinejoin="round" />
  </Svg>
);

export const Star = ({ size = 24, color = '#FFF' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z" fill={color} />
  </Svg>
);

export const Check = ({ size = 24, color = '#FFF' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M5 12.5 10 17.5 19.5 7" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

export const Cross = ({ size = 24, color = '#FFF' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M6 6l12 12M18 6 6 18" stroke={color} strokeWidth={3} strokeLinecap="round" />
  </Svg>
);

export const Lock = ({ size = 24, color = '#A0A4B8' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="5" y="10.5" width="14" height="10" rx="3" fill={color} />
    <Path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke={color} strokeWidth={2.4} fill="none" />
  </Svg>
);

export const Book = ({ size = 24, color = '#FFF' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5zM20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5c.8 0 1.5.7 1.5 1.5z" fill={color} />
  </Svg>
);

export const Trophy = ({ size = 24, color = '#FACC15' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M7 3h10v6a5 5 0 0 1-10 0z" fill={color} />
    <Path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" stroke={color} strokeWidth={2} fill="none" />
    <Rect x="10.5" y="13.5" width="3" height="4" fill={color} />
    <Rect x="7.5" y="17.5" width="9" height="3" rx="1.2" fill={color} />
  </Svg>
);

export const Bulb = ({ size = 24, color = '#FACC15' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" fill={color} />
    <Rect x="9" y="17.2" width="6" height="2" rx="1" fill="#A0A4B8" />
    <Rect x="10" y="20" width="4" height="1.8" rx=".9" fill="#A0A4B8" />
  </Svg>
);

export const HomeIcon = ({ size = 26, color = '#FFF' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M3.5 11 12 3.8l8.5 7.2V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" fill={color} />
  </Svg>
);

export const GridIcon = ({ size = 26, color = '#FFF' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2.2" fill={color} />
    <Rect x="13" y="3.5" width="7.5" height="7.5" rx="2.2" fill={color} />
    <Rect x="3.5" y="13" width="7.5" height="7.5" rx="2.2" fill={color} />
    <Rect x="13" y="13" width="7.5" height="7.5" rx="2.2" fill={color} />
  </Svg>
);

export const UserIcon = ({ size = 26, color = '#FFF' }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="8" r="4.5" fill={color} />
    <Path d="M3.5 21a8.5 8.5 0 0 1 17 0z" fill={color} />
  </Svg>
);

/** Selbst gestaltete Sprach-Abzeichen (keine offiziellen Logos). */
export function LangIcon({ id, size = 48 }: { id: CourseId; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {id === 'python' && (
        <G>
          <Rect x="2" y="2" width="60" height="60" rx="18" fill="#3B82F6" />
          <Path d="M12 42c5-10 11-10 15-3s10 7 14-3" stroke="#FACC15" strokeWidth={8} strokeLinecap="round" fill="none" />
          <Circle cx="44" cy="28" r="8" fill="#FACC15" />
          <Circle cx="46.5" cy="26" r="2" fill="#1D4ED8" />
          <Path d="M51 30l5 2m-5-2 4 4" stroke="#EF4444" strokeWidth={1.8} strokeLinecap="round" />
        </G>
      )}
      {id === 'javascript' && (
        <G>
          <Rect x="2" y="2" width="60" height="60" rx="18" fill="#EAB308" />
          <SvgText x="32" y="42" fontSize="24" fontWeight="900" fill="#1F2340" textAnchor="middle">{'{ }'}</SvgText>
        </G>
      )}
      {id === 'luau' && (
        <G>
          <Rect x="2" y="2" width="60" height="60" rx="18" fill="#8B5CF6" />
          <Circle cx="30" cy="34" r="16" fill="#FFF" />
          <Circle cx="38" cy="28" r="12" fill="#8B5CF6" />
          <Circle cx="47" cy="17" r="4" fill="#FACC15" />
          <Path d="M14 50h10" stroke="#FFF" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
        </G>
      )}
      {id === 'java' && (
        <G>
          <Rect x="2" y="2" width="60" height="60" rx="18" fill="#F97316" />
          <Path d="M17 30h26v8a11 11 0 0 1-11 11h-4a11 11 0 0 1-11-11z" fill="#FFF" />
          <Path d="M43 33h3a5 5 0 0 1 0 10h-4" stroke="#FFF" strokeWidth={3.5} fill="none" />
          <Path d="M25 24c-2-3 2-5 0-9M33 24c-2-3 2-5 0-9" stroke="#FFF" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.85} />
          <Rect x="14" y="51" width="32" height="3.5" rx="1.7" fill="#FFF" opacity={0.7} />
        </G>
      )}
      {id === 'arduino' && (
        <G>
          <Rect x="2" y="2" width="60" height="60" rx="18" fill="#06B6D4" />
          <Rect x="12" y="17" width="40" height="30" rx="4" fill="#0E7490" />
          <Rect x="8" y="22" width="8" height="9" rx="1.5" fill="#CBD5E1" />
          <Rect x="27" y="26" width="16" height="12" rx="2" fill="#1F2340" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Rect key={`t${i}`} x={20 + i * 5} y="19" width="3" height="3" fill="#FACC15" />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <Rect key={`b${i}`} x={22 + i * 5} y="42" width="3" height="3" fill="#FACC15" />
          ))}
          <Circle cx="19" cy="40" r="2.5" fill="#22C55E" />
        </G>
      )}
      {id === 'cpp' && (
        <G>
          <Rect x="2" y="2" width="60" height="60" rx="18" fill="#14B8A6" />
          <Path d="M32 11 50 21.5v21L32 53 14 42.5v-21z" fill="#0F766E" />
          <SvgText x="32" y="39" fontSize="16" fontWeight="900" fill="#FFF" textAnchor="middle">C++</SvgText>
        </G>
      )}
    </Svg>
  );
}
