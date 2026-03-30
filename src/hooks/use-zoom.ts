import { useCallback, useMemo, useRef, useState } from "react";
import type { CameraDevice } from "react-native-vision-camera";

export type ZoomLevel = "0.5x" | "1.0x" | "2.0x" | "4.0x";

const PRESET_MULTIPLIERS: { level: ZoomLevel; multiplier: number }[] = [
  { level: "0.5x", multiplier: 0.5 },
  { level: "1.0x", multiplier: 1 },
  { level: "2.0x", multiplier: 2 },
  { level: "4.0x", multiplier: 4 },
];

/** If the display value is within this threshold of a preset, snap to it */
const SNAP_THRESHOLD = 0.15;

export interface ZoomState {
  selectedZoom: ZoomLevel;
  setSelectedZoom: (zoom: ZoomLevel) => void;
  zoomValue: number;
  supportsUltraWide: boolean;
  /** Non-null when the user is pinch-zooming (continuous value like 3.2) */
  pinchZoomDisplay: number | null;
  onPinchStart: () => void;
  onPinchUpdate: (scale: number) => void;
  /** Resets pinch state when a preset button is tapped */
  selectPreset: (zoom: ZoomLevel) => void;
}

function computeZoomValue(
  zoom: ZoomLevel,
  device: CameraDevice | undefined,
): number {
  if (!device) return 1;

  const { minZoom, neutralZoom, maxZoom } = device;

  let value: number;
  switch (zoom) {
    case "0.5x":
      value = minZoom;
      break;
    case "1.0x":
      value = neutralZoom;
      break;
    case "2.0x":
      value = neutralZoom * 2;
      break;
    case "4.0x":
      value = neutralZoom * 4;
      break;
  }

  return Math.min(Math.max(value, minZoom), maxZoom);
}

/**
 * Converts a raw device zoom value to a user-facing multiplier
 * relative to the neutral (1x) lens.
 */
function toDisplayMultiplier(
  rawZoom: number,
  device: CameraDevice | undefined,
): number {
  if (!device) return 1;
  return rawZoom / device.neutralZoom;
}

export function useZoom(device: CameraDevice | undefined): ZoomState {
  const [selectedZoom, setSelectedZoom] = useState<ZoomLevel>("1.0x");
  const [pinchZoom, setPinchZoom] = useState<number | null>(null);
  const pinchStartZoom = useRef<number>(1);

  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, 16);

  const presetZoomValue = useMemo(
    () => computeZoomValue(selectedZoom, device),
    [selectedZoom, device],
  );

  // Active zoom: pinch value takes priority over preset
  const zoomValue = pinchZoom ?? presetZoomValue;

  const pinchZoomDisplay = useMemo(() => {
    if (pinchZoom === null) return null;
    const multiplier = toDisplayMultiplier(pinchZoom, device);
    return Math.round(multiplier * 10) / 10;
  }, [pinchZoom, device]);

  const supportsUltraWide = useMemo(
    () => (device ? device.minZoom < device.neutralZoom : false),
    [device],
  );

  const onPinchStart = useCallback(() => {
    pinchStartZoom.current = zoomValue;
  }, [zoomValue]);

  const onPinchUpdate = useCallback(
    (scale: number) => {
      const newZoom = Math.min(
        Math.max(pinchStartZoom.current * scale, minZoom),
        maxZoom,
      );
      // Check if the pinch value is close to a preset
      const displayValue = device ? newZoom / device.neutralZoom : 1;
      const matchedPreset = PRESET_MULTIPLIERS.find(
        ({ multiplier }) => Math.abs(displayValue - multiplier) < SNAP_THRESHOLD,
      );
      if (matchedPreset) {
        setPinchZoom(null);
        setSelectedZoom(matchedPreset.level);
      } else {
        setPinchZoom(newZoom);
      }
    },
    [minZoom, maxZoom, device],
  );

  const selectPreset = useCallback(
    (zoom: ZoomLevel) => {
      setPinchZoom(null);
      setSelectedZoom(zoom);
    },
    [],
  );

  return {
    selectedZoom,
    setSelectedZoom,
    zoomValue,
    supportsUltraWide,
    pinchZoomDisplay,
    onPinchStart,
    onPinchUpdate,
    selectPreset,
  };
}
