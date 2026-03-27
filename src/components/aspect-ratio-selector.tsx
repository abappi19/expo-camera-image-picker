import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import type { AspectRatio } from '../hooks/use-aspect-ratio';
import { getContrastColor } from '../utils/contrast-color';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onSelect: (ratio: AspectRatio) => void;
  expanded: boolean;
  onToggle: () => void;
  accentColor?: string;
}

const RATIOS: AspectRatio[] = ['16:9', '4:3', '1:1'];

export function AspectRatioSelector({
  selectedRatio,
  onSelect,
  expanded,
  onToggle,
  accentColor = '#FFFFFF',
}: AspectRatioSelectorProps) {
  const contrastColor = useMemo(() => getContrastColor(accentColor), [accentColor]);
  const handleSelect = useCallback((ratio: AspectRatio) => {
    onSelect(ratio);
  }, [onSelect]);

  return (
    <>
      {!expanded && (
        <Animated.View
          style={styles.collapsedContainer}
          entering={FadeIn.duration(200).withInitialValues({ transform: [{ scaleX: 0.3 }] })}
          exiting={FadeOut.duration(150).withInitialValues({ transform: [{ scaleX: 1 }] })}
        >
          <Pressable
            onPress={onToggle}
            style={[styles.collapsedButton, { backgroundColor: accentColor }]}
            accessibilityRole="button"
            accessibilityLabel={`Aspect ratio ${selectedRatio}`}
          >
            <Text style={[styles.collapsedText, { color: contrastColor }]}>{selectedRatio}</Text>
          </Pressable>
        </Animated.View>
      )}
      {expanded && (
        <Animated.View
          style={styles.expandedContainer}
          entering={FadeIn.duration(250).withInitialValues({ transform: [{ scaleX: 0.3 }] })}
          exiting={FadeOut.duration(150).withInitialValues({ transform: [{ scaleX: 1 }] })}
        >
          {RATIOS.map((ratio) => {
            const isActive = ratio === selectedRatio;
            return (
              <Pressable
                key={ratio}
                onPress={() => handleSelect(ratio)}
                style={[
                  styles.circle,
                  isActive ? { backgroundColor: accentColor } : styles.circleInactive,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Aspect ratio ${ratio}`}
                accessibilityState={{ selected: isActive }}
              >
                <Text style={[styles.label, isActive ? { color: contrastColor } : styles.labelInactive]}>
                  {ratio}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  collapsedContainer: {
    padding: 4,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  collapsedButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapsedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  // Match zoom-selector container style exactly
  expandedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 22,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  // Match zoom-selector circle style exactly
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInactive: {
    backgroundColor: 'transparent',
  },
  // Match zoom-selector label style
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  labelActive: {
    color: '#000000',
  },
  labelInactive: {
    color: 'rgba(255,255,255,0.85)',
  },
});
