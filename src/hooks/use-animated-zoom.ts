import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import type { CameraProps } from 'react-native-vision-camera';

const ZOOM_ANIMATION_DURATION = 300;

export function useAnimatedZoom(targetZoom: number) {
  const zoom = useSharedValue(targetZoom);

  useEffect(() => {
    zoom.value = withTiming(targetZoom, { duration: ZOOM_ANIMATION_DURATION });
  }, [targetZoom, zoom]);

  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({ zoom: zoom.value }),
    [zoom]
  );

  return animatedProps;
}
