import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './icon-props';

export function FlashAutoIcon({ size = 20, color = '#FFFFFF', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10 2L2 13h7l-1 7 8-11H9l1-7z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17.5 22l3-8 3 8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M18.5 19.5h4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
