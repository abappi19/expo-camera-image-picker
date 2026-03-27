import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import type { AspectRatio } from '../hooks/use-aspect-ratio';

const RATIO_VALUES: Record<AspectRatio, number> = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '1:1': 1,
};

const CORNER_SIZE = 42;
const CORNER_THICKNESS = 4;
const ANIM_DURATION = 650;

interface RatioTransitionOverlayProps {
  accentColor?: string;
}

export function useRatioTransition() {
  const isVisible = useSharedValue(false);
  const frameTop = useSharedValue(0);
  const frameLeft = useSharedValue(0);
  const frameWidth = useSharedValue(0);
  const frameHeight = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const show = (targetRatio: AspectRatio, onDone?: () => void) => {
    'worklet';
    const ratioValue = RATIO_VALUES[targetRatio];
    let w = screenWidth;
    let h = screenWidth * ratioValue;
    if (h > screenHeight) {
      h = screenHeight;
      w = screenHeight / ratioValue;
    }
    const t = (screenHeight - h) / 2;
    const l = (screenWidth - w) / 2;

    // Show overlay instantly
    isVisible.value = true;
    overlayOpacity.value = 1;

    // Animate corners to target frame
    frameTop.value = withTiming(t, { duration: ANIM_DURATION, easing: Easing.out(Easing.cubic) });
    frameLeft.value = withTiming(l, { duration: ANIM_DURATION, easing: Easing.out(Easing.cubic) });
    frameWidth.value = withTiming(w, { duration: ANIM_DURATION, easing: Easing.out(Easing.cubic) });
    frameHeight.value = withTiming(h, { duration: ANIM_DURATION, easing: Easing.out(Easing.cubic) });

    // Fade out after animation, then hide
    overlayOpacity.value = withDelay(
      ANIM_DURATION + 100,
      withTiming(0, { duration: 250 }, (finished) => {
        if (finished) {
          isVisible.value = false;
          if (onDone) runOnJS(onDone)();
        }
      }),
    );
  };

  const initFrom = (currentRatio: AspectRatio) => {
    const ratioValue = RATIO_VALUES[currentRatio];
    let w = screenWidth;
    let h = screenWidth * ratioValue;
    if (h > screenHeight) {
      h = screenHeight;
      w = screenHeight / ratioValue;
    }
    frameTop.value = (screenHeight - h) / 2;
    frameLeft.value = (screenWidth - w) / 2;
    frameWidth.value = w;
    frameHeight.value = h;
  };

  return { show, initFrom, isVisible, frameTop, frameLeft, frameWidth, frameHeight, overlayOpacity };
}

export function RatioTransitionOverlay({
  accentColor = '#FFFFFF',
}: RatioTransitionOverlayProps & ReturnType<typeof useRatioTransition>) {
  // This is intentionally empty — we need the hook values passed as props
  return null;
}

// The actual rendered component
export function RatioTransitionOverlayView({
  accentColor = '#FFFFFF',
  isVisible,
  frameTop,
  frameLeft,
  frameWidth,
  frameHeight,
  overlayOpacity,
}: RatioTransitionOverlayProps & ReturnType<typeof useRatioTransition>) {
  const containerStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    display: isVisible.value ? 'flex' : 'none',
  }));

  const topLeftStyle = useAnimatedStyle(() => ({
    top: frameTop.value,
    left: frameLeft.value,
  }));

  const topRightStyle = useAnimatedStyle(() => ({
    top: frameTop.value,
    left: frameLeft.value + frameWidth.value - CORNER_SIZE,
  }));

  const bottomLeftStyle = useAnimatedStyle(() => ({
    top: frameTop.value + frameHeight.value - CORNER_SIZE,
    left: frameLeft.value,
  }));

  const bottomRightStyle = useAnimatedStyle(() => ({
    top: frameTop.value + frameHeight.value - CORNER_SIZE,
    left: frameLeft.value + frameWidth.value - CORNER_SIZE,
  }));

  return (
    <Animated.View style={[styles.overlay, containerStyle]} pointerEvents="none">
      {/* Top-left corner */}
      <Animated.View style={[styles.corner, topLeftStyle]}>
        <Animated.View style={[styles.cornerH, styles.cornerTop, { backgroundColor: accentColor }]} />
        <Animated.View style={[styles.cornerV, styles.cornerLeft, { backgroundColor: accentColor }]} />
      </Animated.View>

      {/* Top-right corner */}
      <Animated.View style={[styles.corner, topRightStyle]}>
        <Animated.View style={[styles.cornerH, styles.cornerTop, styles.cornerHRight, { backgroundColor: accentColor }]} />
        <Animated.View style={[styles.cornerV, styles.cornerRight, { backgroundColor: accentColor }]} />
      </Animated.View>

      {/* Bottom-left corner */}
      <Animated.View style={[styles.corner, bottomLeftStyle]}>
        <Animated.View style={[styles.cornerH, styles.cornerBottom, { backgroundColor: accentColor }]} />
        <Animated.View style={[styles.cornerV, styles.cornerLeft, styles.cornerVBottom, { backgroundColor: accentColor }]} />
      </Animated.View>

      {/* Bottom-right corner */}
      <Animated.View style={[styles.corner, bottomRightStyle]}>
        <Animated.View style={[styles.cornerH, styles.cornerBottom, styles.cornerHRight, { backgroundColor: accentColor }]} />
        <Animated.View style={[styles.cornerV, styles.cornerRight, styles.cornerVBottom, { backgroundColor: accentColor }]} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 20,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  // Horizontal bar
  cornerH: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_THICKNESS,
    borderRadius: CORNER_THICKNESS / 2,
  },
  // Vertical bar
  cornerV: {
    position: 'absolute',
    width: CORNER_THICKNESS,
    height: CORNER_SIZE,
    borderRadius: CORNER_THICKNESS / 2,
  },
  // Positions
  cornerTop: { top: 0, left: 0 },
  cornerBottom: { bottom: 0, left: 0 },
  cornerLeft: { top: 0, left: 0 },
  cornerRight: { top: 0, right: 0 },
  cornerHRight: { left: undefined, right: 0 },
  cornerVBottom: { top: undefined, bottom: 0 },
});
