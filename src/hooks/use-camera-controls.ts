import { useRef, useState } from 'react';
import type { Camera, Point, TakePhotoOptions } from 'react-native-vision-camera';

export function useCameraControls() {
  const cameraRef = useRef<Camera>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = async (options?: TakePhotoOptions) => {
    if (!cameraRef.current) return null;
    setIsCapturing(true);
    try {
      return await cameraRef.current.takePhoto(options);
    } finally {
      setIsCapturing(false);
    }
  };

  const focus = async (point: Point) => {
    if (!cameraRef.current) return;
    await cameraRef.current.focus(point);
  };

  return { cameraRef, isCapturing, capture, focus };
}
