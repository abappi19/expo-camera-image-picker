import { useState } from "react";
import type {
  CameraDevice,
  CameraDeviceFormat,
} from "react-native-vision-camera";
import { useCameraFormat } from "react-native-vision-camera";

export type AspectRatio = "16:9" | "4:3" | "1:1";

export interface AspectRatioState {
  selectedRatio: AspectRatio;
  setSelectedRatio: (ratio: AspectRatio) => void;
  format: CameraDeviceFormat | undefined;
  ratioValue: number;
}

const RATIO_VALUES: Record<AspectRatio, number> = {
  "16:9": 16 / 9,
  "4:3": 4 / 3,
  "1:1": 1 / 1,
};

export function useAspectRatio(
  device: CameraDevice | undefined,
): AspectRatioState {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>("16:9");
  const ratioValue = RATIO_VALUES[selectedRatio];

  // Always request 4:3 (native sensor ratio) for best quality.
  // The selected aspect ratio is applied as a visual crop only.
  const format = useCameraFormat(device, [
    { photoAspectRatio: ratioValue },
    { videoAspectRatio: ratioValue },
  ]);

  return { selectedRatio, setSelectedRatio, format, ratioValue };
}
