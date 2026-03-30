import { useRef, useState, useCallback } from "react";
import { Camera, type CameraType } from "../components/vision-camera";

import type { CaptureResult } from "../types/camera.types";

export function useCameraControls() {
  const cameraRef = useRef<CameraType>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = useCallback(
    async (
      flash: "off" | "on" | "auto" = "off",
    ): Promise<CaptureResult | null> => {
      if (isCapturing || !cameraRef.current) return null;

      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePhoto({ flash });
        const uri = `file://${photo.path}`;
        return {
          uri,
          width: photo.width,
          height: photo.height,
          path: photo.path,
        };
      } catch (error) {
        console.error("[CameraControls] Capture failed:", error);
        return null;
      } finally {
        setIsCapturing(false);
      }
    },
    [isCapturing],
  );

  return { cameraRef, capture, isCapturing };
}
