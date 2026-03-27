import React, { useMemo } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

import type { ZoomLevel } from "../hooks/use-zoom";
import { getContrastColor } from "../utils/contrast-color";

interface ZoomSelectorProps {
  selectedZoom: ZoomLevel;
  onSelect: (zoom: ZoomLevel) => void;
  supportsUltraWide: boolean;
  accentColor?: string;
}

const ZOOM_LEVELS: ZoomLevel[] = ["0.5x", "1.0x", "2.0x", "4.0x"];

const ZOOM_LABELS: Record<ZoomLevel, string> = {
  "0.5x": ".5",
  "1.0x": "1",
  "2.0x": "2",
  "4.0x": "4",
};

export function ZoomSelector({
  selectedZoom,
  onSelect,
  supportsUltraWide,
  accentColor = "#FFFFFF",
}: ZoomSelectorProps) {
  const contrastColor = useMemo(
    () => getContrastColor(accentColor),
    [accentColor],
  );
  return (
    <View style={styles.container}>
      {ZOOM_LEVELS.map((zoom) => {
        const isActive = zoom === selectedZoom;
        const isDisabled = zoom === "0.5x" && !supportsUltraWide;

        return (
          <Pressable
            key={zoom}
            onPress={() => {
              if (!isDisabled) {
                onSelect(zoom);
              }
            }}
            style={[
              styles.circle,
              isActive
                ? { backgroundColor: accentColor }
                : isDisabled
                  ? styles.circleDisabled
                  : styles.circleInactive,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Zoom ${zoom}`}
            accessibilityState={{ selected: isActive, disabled: isDisabled }}
          >
            <Text
              style={[
                styles.label,
                isActive
                  ? { color: contrastColor }
                  : isDisabled
                    ? styles.labelDisabled
                    : styles.labelInactive,
              ]}
            >
              {ZOOM_LABELS[zoom]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 22,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  circleInactive: {
    backgroundColor: "transparent",
  },
  circleDisabled: {
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
  labelActive: {
    color: "#000000",
  },
  labelInactive: {
    color: "rgba(255,255,255,0.85)",
  },
  labelDisabled: {
    color: "rgba(255,255,255,0.25)",
  },
});
