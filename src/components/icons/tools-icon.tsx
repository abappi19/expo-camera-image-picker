import React from "react";
import Svg, { Line, Circle } from "react-native-svg";

import type { IconProps } from "./icon-props";

export function ToolsIcon({
  size = 20,
  color = "#FFFFFF",
  strokeWidth = 1.5,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line
        x1="4"
        y1="8"
        x2="20"
        y2="8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Line
        x1="4"
        y1="16"
        x2="20"
        y2="16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Circle cx="9" cy="8" r="2.5" stroke={color} strokeWidth={strokeWidth} />
      <Circle
        cx="15"
        cy="16"
        r="2.5"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}
