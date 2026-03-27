import React, { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { getContrastColor } from '../utils/contrast-color';
import { GridIcon } from './icons';

interface GridButtonProps {
  showGrid: boolean;
  onToggle: () => void;
  accentColor?: string;
}

export function GridButton({
  showGrid,
  onToggle,
  accentColor = '#FFFFFF',
}: GridButtonProps) {
  const contrastColor = useMemo(() => getContrastColor(accentColor), [accentColor]);
  const iconColor = showGrid ? contrastColor : '#FFFFFF';

  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles.button,
        showGrid ? { backgroundColor: accentColor } : styles.buttonInactive,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Grid: ${showGrid ? 'on' : 'off'}`}
      accessibilityState={{ selected: showGrid }}
    >
      <GridIcon size={18} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonInactive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
