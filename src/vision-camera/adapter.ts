import type { CameraPickerOptions } from '../types';

export function normalizeZoom(value: number | undefined): number {
  if (value == null || Number.isNaN(value)) return 1;
  return Math.max(0.5, Math.min(10, value));
}

export function normalizeQuality(value: number | undefined): number {
  if (value == null || Number.isNaN(value)) return 1;
  return Math.max(0.1, Math.min(1, value));
}

export function mergeOptions(base: CameraPickerOptions, next?: CameraPickerOptions): CameraPickerOptions {
  return {
    ...base,
    ...next,
    initialZoom: normalizeZoom(next?.initialZoom ?? base.initialZoom),
    quality: normalizeQuality(next?.quality ?? base.quality),
  };
}
