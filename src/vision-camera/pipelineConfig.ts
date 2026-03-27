import type { FilterValues } from '../types';
import type { RuntimePerfConfig } from '../utils/performanceMode';

export interface PipelineConfig {
  exposureOffset: number;
  overlayOpacity: number;
  temperatureTintShift: number;
}

export function buildPipelineConfig(filters: FilterValues, perf: RuntimePerfConfig): PipelineConfig {
  return {
    exposureOffset: filters.brightness * 0.2,
    overlayOpacity: Math.max(0, Math.min(0.8, Math.abs(filters.contrast) * perf.filterStrengthScale)),
    temperatureTintShift: (filters.warmth + filters.tint) * 0.5,
  };
}
