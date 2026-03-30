import { useCallback, useRef, useState } from "react";
import type { GestureResponderEvent } from "react-native";
import type { CameraType as Camera } from "../components/vision-camera";

export interface FocusPoint {
  x: number;
  y: number;
}

export interface TapToFocusState {
  focusPoint: FocusPoint | null;
  handleTap: (event: GestureResponderEvent) => void;
}

export function useTapToFocus(
  cameraRef: React.RefObject<Camera | null>,
): TapToFocusState {
  const [focusPoint, setFocusPoint] = useState<FocusPoint | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = useCallback(
    (event: GestureResponderEvent) => {
      const { locationX, locationY } = event.nativeEvent;

      setFocusPoint({ x: locationX, y: locationY });

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Hide focus indicator after 1.5s
      timeoutRef.current = setTimeout(() => {
        setFocusPoint(null);
      }, 1500);

      // Trigger camera focus
      try {
        cameraRef.current?.focus({ x: locationX, y: locationY });
      } catch {
        // Focus may not be supported on all devices
      }
    },
    [cameraRef],
  );

  return { focusPoint, handleTap };
}
