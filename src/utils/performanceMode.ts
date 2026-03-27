import type { PerformanceMode } from '../types';

export interface RuntimePerfConfig {
  frameProcessorFps: number;
  filterStrengthScale: number;
  enableGuides: boolean;
}

export function getPerfConfig(mode: PerformanceMode = 'balanced'): RuntimePerfConfig {
  if (mode === 'speed') {
    return { frameProcessorFps: 8, filterStrengthScale: 0.75, enableGuides: false };
  }

  if (mode === 'quality') {
    return { frameProcessorFps: 30, filterStrengthScale: 1, enableGuides: true };
  }

  return { frameProcessorFps: 16, filterStrengthScale: 0.9, enableGuides: true };
}
