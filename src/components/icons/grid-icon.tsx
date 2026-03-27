import React from 'react';
import Svg, { Line, Rect } from 'react-native-svg';
import type { IconProps } from './icon-props';

export function GridIcon({ size = 20, color = '#FFFFFF', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="9" y1="3" x2="9" y2="21" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="15" y1="3" x2="15" y2="21" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="3" y1="15" x2="21" y2="15" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}
