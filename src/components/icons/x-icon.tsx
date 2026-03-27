import React from "react";
import Svg, { Path } from "react-native-svg";

import type { IconProps } from "./icon-props";

export function XIcon({
  size = 24,
  color = "#FFFFFF",
  strokeWidth = 2,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
