import React, { useCallback, useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import type { FilterPreset } from "../hooks/use-filters";
import { FILTER_PRESETS } from "../hooks/use-filters";
import { getContrastColor } from "../utils/contrast-color";
import { ToolsIcon } from "./icons/tools-icon";

interface ToolsButtonProps {
  expanded: boolean;
  onToggle: () => void;
  presetId: string;
  onPresetSelect: (id: string) => void;
  hasActiveFilters: boolean;
  accentColor?: string;
}

export function ToolsButton({
  expanded,
  onToggle,
  presetId,
  onPresetSelect,
  hasActiveFilters,
  accentColor = "#FFFFFF",
}: ToolsButtonProps) {
  const contrastColor = useMemo(
    () => getContrastColor(accentColor),
    [accentColor],
  );

  const handlePresetSelect = useCallback(
    (preset: FilterPreset) => {
      onPresetSelect(preset.id);
    },
    [onPresetSelect],
  );

  return (
    <>
      {!expanded && (
        <Animated.View
          style={styles.collapsedContainer}
          entering={FadeIn.duration(200).withInitialValues({
            transform: [{ scaleX: 0.3 }],
          })}
          exiting={FadeOut.duration(150).withInitialValues({
            transform: [{ scaleX: 1 }],
          })}
        >
          <Pressable
            onPress={onToggle}
            style={[
              styles.collapsedButton,
              hasActiveFilters
                ? { backgroundColor: accentColor }
                : styles.collapsedButtonInactive,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Camera tools"
          >
            <ToolsIcon
              size={18}
              color={hasActiveFilters ? contrastColor : "#FFFFFF"}
            />
          </Pressable>
        </Animated.View>
      )}
      {expanded && (
        <Animated.View
          style={styles.expandedContainer}
          entering={FadeIn.duration(250).withInitialValues({
            transform: [{ scaleX: 0.3 }],
          })}
          exiting={FadeOut.duration(150).withInitialValues({
            transform: [{ scaleX: 1 }],
          })}
        >
          {FILTER_PRESETS.map((preset) => {
            const isActive = preset.id === presetId;
            return (
              <Pressable
                key={preset.id}
                onPress={() => handlePresetSelect(preset)}
                style={[
                  styles.presetPill,
                  isActive
                    ? { backgroundColor: accentColor }
                    : styles.presetPillInactive,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Filter preset ${preset.label}`}
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[
                    styles.presetLabel,
                    isActive
                      ? { color: contrastColor }
                      : styles.presetLabelInactive,
                  ]}
                >
                  {preset.label}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            onPress={onToggle}
            style={styles.closeButton}
            accessibilityLabel="Close tools"
          >
            <Text style={styles.closeText}>Done</Text>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  collapsedContainer: {
    padding: 4,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  collapsedButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  collapsedButtonInactive: {
    backgroundColor: "transparent",
  },
  expandedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 22,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  presetPill: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  presetPillInactive: {
    backgroundColor: "transparent",
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  presetLabelInactive: {
    color: "rgba(255,255,255,0.85)",
  },
  closeButton: {
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  closeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
