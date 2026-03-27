import { useState, useCallback, useMemo } from "react";
import type { CameraDevice } from "react-native-vision-camera";

export type FlashMode = "off" | "on" | "auto" | "torch";

type PhotoFlash = "off" | "on" | "auto";

const PHOTO_FLASH_MAP: Record<FlashMode, PhotoFlash> = {
  off: "off",
  on: "on",
  auto: "auto",
  torch: "off", // LED already on, no flash burst needed
};

export interface FlashState {
  flashMode: FlashMode;
  setFlashMode: (mode: FlashMode) => void;
  cycleFlashMode: () => void;
  resetFlash: () => void;
  torchEnabled: boolean;
  photoFlash: PhotoFlash;
  supportsFlash: boolean;
  supportsTorch: boolean;
}

export function useFlash(device: CameraDevice | undefined): FlashState {
  const [flashMode, setFlashMode] = useState<FlashMode>("off");

  const supportsFlash = useMemo(() => device?.hasFlash ?? false, [device]);
  const supportsTorch = useMemo(() => device?.hasTorch ?? false, [device]);

  const cycleFlashMode = useCallback(() => {
    setFlashMode((current) => {
      switch (current) {
        case "off":
          return "on";
        case "on":
          return "auto";
        case "auto":
          return supportsTorch ? "torch" : "off";
        case "torch":
          return "off";
      }
    });
  }, [supportsTorch]);

  const torchEnabled = flashMode === "torch";
  const photoFlash = PHOTO_FLASH_MAP[flashMode];

  const resetFlash = useCallback(() => setFlashMode("off"), []);

  return {
    flashMode,
    setFlashMode,
    cycleFlashMode,
    resetFlash,
    torchEnabled,
    photoFlash,
    supportsFlash,
    supportsTorch,
  };
}
