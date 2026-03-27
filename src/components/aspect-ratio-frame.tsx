import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import type { AspectRatio } from '../hooks/use-aspect-ratio';

const RATIO_VALUES: Record<AspectRatio, number> = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '1:1': 1,
};

export function useAspectRatioLayout(ratio: AspectRatio) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  return useMemo(() => {
    const ratioValue = RATIO_VALUES[ratio];

    // Use the smaller dimension as constraint
    let frameWidth = screenWidth;
    let frameHeight = screenWidth * ratioValue;

    if (frameHeight > screenHeight) {
      frameHeight = screenHeight;
      frameWidth = screenHeight / ratioValue;
    }

    return { frameWidth, frameHeight };
  }, [ratio, screenWidth, screenHeight]);
}
