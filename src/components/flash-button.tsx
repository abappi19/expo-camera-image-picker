import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import type { FlashMode } from '../hooks/use-flash';
import { getContrastColor } from '../utils/contrast-color';
import { FlashAutoIcon, FlashOffIcon, FlashOnIcon, TorchIcon } from './icons';

interface FlashButtonProps {
  flashMode: FlashMode;
  onSelect: (mode: FlashMode) => void;
  expanded: boolean;
  onToggle: () => void;
  supportsFlash: boolean;
  supportsTorch: boolean;
  accentColor?: string;
}

const FLASH_ICON_MAP: Record<FlashMode, React.ComponentType<{ size?: number; color?: string }>> = {
  off: FlashOffIcon,
  on: FlashOnIcon,
  auto: FlashAutoIcon,
  torch: TorchIcon,
};

const FLASH_MODES: FlashMode[] = ['off', 'on', 'auto', 'torch'];

export function FlashButton({
  flashMode,
  onSelect,
  expanded,
  onToggle,
  supportsFlash,
  supportsTorch,
  accentColor = '#FFFFFF',
}: FlashButtonProps) {
  const handleSelect = useCallback((mode: FlashMode) => {
    onSelect(mode);
  }, [onSelect]);

  const ActiveIcon = FLASH_ICON_MAP[flashMode];
  const contrastColor = useMemo(() => getContrastColor(accentColor), [accentColor]);

  const modes = supportsTorch ? FLASH_MODES : FLASH_MODES.filter((m) => m !== 'torch');

  return (
    <>
      {!expanded && (
        <Animated.View
          entering={FadeIn.duration(200).withInitialValues({ transform: [{ scaleX: 0.3 }] })}
          exiting={FadeOut.duration(150).withInitialValues({ transform: [{ scaleX: 1 }] })}
        >
          <Pressable
            onPress={() => {
              if (supportsFlash) onToggle();
            }}
            style={[
              styles.collapsedButton,
              !supportsFlash ? styles.buttonDisabled : { backgroundColor: accentColor },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Flash: ${flashMode}`}
            accessibilityState={{ disabled: !supportsFlash }}
          >
            <ActiveIcon size={18} color={!supportsFlash ? 'rgba(255,255,255,0.3)' : contrastColor} />
          </Pressable>
        </Animated.View>
      )}
      {expanded && (
        <Animated.View
          style={styles.expandedContainer}
          entering={FadeIn.duration(200).withInitialValues({ transform: [{ scaleX: 0.3 }] })}
          exiting={FadeOut.duration(150).withInitialValues({ transform: [{ scaleX: 1 }] })}
        >
          {modes.map((mode) => {
            const Icon = FLASH_ICON_MAP[mode];
            const isCurrent = mode === flashMode;
            return (
              <Pressable
                key={mode}
                onPress={() => handleSelect(mode)}
                style={[
                  styles.optionButton,
                  isCurrent ? { backgroundColor: accentColor } : styles.optionInactive,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Flash: ${mode}`}
                accessibilityState={{ selected: isCurrent }}
              >
                <Icon size={18} color={isCurrent ? contrastColor : 'rgba(255,255,255,0.85)'} />
              </Pressable>
            );
          })}
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  collapsedButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonInactive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  expandedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 22,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  optionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionInactive: {
    backgroundColor: 'transparent',
  },
});
