import React from 'react';
import {
  Pressable,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

interface ShutterButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isCapturing?: boolean;
  accentColor?: string;
}

const OUTER_SIZE = 72;
const INNER_SIZE = 58;
const BORDER_WIDTH = 4;

export function ShutterButton({
  onPress,
  disabled = false,
  isCapturing = false,
  accentColor = '#FFFFFF',
}: ShutterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isCapturing}
      style={({ pressed }) => [
        styles.outer,
        { borderColor: accentColor },
        pressed && styles.outerPressed,
        (disabled || isCapturing) && styles.outerDisabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Take photo"
    >
      {isCapturing ? (
        <ActivityIndicator size="small" color={accentColor} />
      ) : (
        <View style={[styles.inner, { backgroundColor: accentColor }]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    borderRadius: OUTER_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  outerPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  outerDisabled: {
    opacity: 0.4,
  },
  inner: {
    width: INNER_SIZE,
    height: INNER_SIZE,
    borderRadius: INNER_SIZE / 2,
  },
});
