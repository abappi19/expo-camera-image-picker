import { useMemo } from 'react';
import type { FilterValues } from '../types';
import type { RuntimePerfConfig } from '../utils/performanceMode';

export interface FrameProcessorRuntime {
  enabled: boolean;
  targetFps: number;
  debugLabel: string;
}

export function useFrameProcessorRuntime(filters: FilterValues, perf: RuntimePerfConfig): FrameProcessorRuntime {
  return useMemo(() => {
    const hasFilters = Object.values(filters).some((value) => Math.abs(value) > 0.01);
    return {
      enabled: hasFilters,
      targetFps: perf.frameProcessorFps,
      debugLabel: hasFilters ? 'filters-active' : 'filters-idle',
    };
  }, [filters, perf.frameProcessorFps]);
}
