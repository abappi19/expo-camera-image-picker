import React from "react";
import Svg, { Line, Path } from "react-native-svg";

import type { IconProps } from "./icon-props";

export function TorchIcon({
  size = 20,
  color = "#FFFFFF",
  strokeWidth = 1.8,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 3h12v4l-3 2v2H9V9L6 7V3z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="6"
        y1="7"
        x2="18"
        y2="7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M9 11v9a1 1 0 001 1h4a1 1 0 001-1v-9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
