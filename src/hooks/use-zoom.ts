import { useState, useMemo } from 'react';
import type { CameraDevice } from 'react-native-vision-camera';

export type ZoomLevel = '0.5x' | '1.0x' | '2.0x' | '4.0x';

export interface ZoomState {
  selectedZoom: ZoomLevel;
  setSelectedZoom: (zoom: ZoomLevel) => void;
  zoomValue: number;
  supportsUltraWide: boolean;
}

function computeZoomValue(
  zoom: ZoomLevel,
  device: CameraDevice | undefined,
): number {
  if (!device) return 1;

  const { minZoom, neutralZoom, maxZoom } = device;

  let value: number;
  switch (zoom) {
    case '0.5x':
      value = minZoom;
      break;
    case '1.0x':
      value = neutralZoom;
      break;
    case '2.0x':
      value = neutralZoom * 2;
      break;
    case '4.0x':
      value = neutralZoom * 4;
      break;
  }

  return Math.min(Math.max(value, minZoom), maxZoom);
}

export function useZoom(device: CameraDevice | undefined): ZoomState {
  const [selectedZoom, setSelectedZoom] = useState<ZoomLevel>('1.0x');

  const zoomValue = useMemo(
    () => computeZoomValue(selectedZoom, device),
    [selectedZoom, device],
  );

  const supportsUltraWide = useMemo(
    () => (device ? device.minZoom < device.neutralZoom : false),
    [device],
  );

  return { selectedZoom, setSelectedZoom, zoomValue, supportsUltraWide };
}
