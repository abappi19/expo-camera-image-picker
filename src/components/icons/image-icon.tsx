import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import type { IconProps } from "./icon-props";

export function ImageIcon({
  size = 20,
  color = "#FFFFFF",
  strokeWidth = 1.5,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Circle
        cx="8.5"
        cy="8.5"
        r="1.5"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M21 15l-5-5L5 21"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
