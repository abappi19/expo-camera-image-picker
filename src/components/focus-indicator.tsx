import React from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import type { FocusPoint } from "../hooks/use-tap-to-focus";

interface FocusIndicatorProps {
  point: FocusPoint;
  accentColor?: string;
}

const INDICATOR_SIZE = 64;

export function FocusIndicator({
  point,
  accentColor = "#FFFFFF",
}: FocusIndicatorProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(300)}
      style={[
        styles.indicator,
        {
          borderColor: accentColor,
          left: point.x - INDICATOR_SIZE / 2,
          top: point.y - INDICATOR_SIZE / 2,
        },
      ]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderWidth: 1.5,
    borderRadius: 2,
    zIndex: 15,
  },
});
