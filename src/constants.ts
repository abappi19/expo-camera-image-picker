import type { FilterPreset, FilterValues, SupportedFeatures } from './types';

export const DEFAULT_FILTER_VALUES: FilterValues = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
};

export const DEFAULT_SUPPORTED_FEATURES: SupportedFeatures = {
  flash: false,
  torch: false,
  focus: false,
  exposure: false,
  ultraWide: false,
  filters: true,
  horizonGuide: false,
};

export const FILTER_PRESETS: FilterPreset[] = [
  { id: 'natural', label: 'Natural', values: { ...DEFAULT_FILTER_VALUES } },
  { id: 'vivid', label: 'Vivid', values: { ...DEFAULT_FILTER_VALUES, contrast: 0.2, saturation: 0.25, highlights: -0.1 } },
  { id: 'warm', label: 'Warm', values: { ...DEFAULT_FILTER_VALUES, warmth: 0.25, tint: 0.1 } },
  { id: 'cool', label: 'Cool', values: { ...DEFAULT_FILTER_VALUES, warmth: -0.2, tint: -0.1 } },
  { id: 'mono', label: 'Mono', values: { ...DEFAULT_FILTER_VALUES, saturation: -1, contrast: 0.15 } },
];

export const ZOOM_PRESETS = [0.5, 1, 2, 4];
export const ASPECT_RATIOS = ['16:9', '4:3', '1:1'] as const;
