import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { CameraSwitchIcon } from './icons';

const HOLD_DURATION = 600;
const FADE_DURATION = 400;

export function useCameraFlip() {
  const isVisible = useSharedValue(false);
  const opacity = useSharedValue(0);
  const iconRotation = useSharedValue(0);

  const trigger = () => {
    isVisible.value = true;
    opacity.value = 1;
    iconRotation.value = 0;
    iconRotation.value = withTiming(180, { duration: HOLD_DURATION });
    opacity.value = withDelay(
      HOLD_DURATION,
      withTiming(0, { duration: FADE_DURATION }, (finished) => {
        if (finished) {
          isVisible.value = false;
        }
      }),
    );
  };

  return { trigger, isVisible, opacity, iconRotation };
}

interface CameraFlipOverlayProps {
  accentColor?: string;
  isVisible: ReturnType<typeof useCameraFlip>['isVisible'];
  opacity: ReturnType<typeof useCameraFlip>['opacity'];
  iconRotation: ReturnType<typeof useCameraFlip>['iconRotation'];
}

export function CameraFlipOverlayView({
  accentColor = '#FFFFFF',
  isVisible,
  opacity,
  iconRotation,
}: CameraFlipOverlayProps) {
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    display: isVisible.value ? 'flex' : 'none',
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.overlay, containerStyle]} pointerEvents="none">
      <Animated.View style={iconStyle}>
        <CameraSwitchIcon size={64} color={accentColor} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
});
