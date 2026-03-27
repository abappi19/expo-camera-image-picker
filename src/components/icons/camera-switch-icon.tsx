import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './icon-props';

export function CameraSwitchIcon({ size = 24, color = '#FFFFFF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.5 5.5A8.5 8.5 0 0118.5 5.5l-2.5 2.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 18.5A8.5 8.5 0 015.5 18.5l2.5-2.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
