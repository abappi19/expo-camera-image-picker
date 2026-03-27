import { useState, useCallback, useMemo } from "react";

export interface FilterValues {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  tint: number;
  highlights: number;
  shadows: number;
}

export interface FilterPreset {
  id: string;
  label: string;
  values: FilterValues;
}

const DEFAULT_FILTER_VALUES: FilterValues = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
};

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: "natural",
    label: "Natural",
    values: { ...DEFAULT_FILTER_VALUES },
  },
  {
    id: "vivid",
    label: "Vivid",
    values: {
      ...DEFAULT_FILTER_VALUES,
      contrast: 0.2,
      saturation: 0.25,
      highlights: -0.1,
    },
  },
  {
    id: "warm",
    label: "Warm",
    values: { ...DEFAULT_FILTER_VALUES, warmth: 0.25, tint: 0.1 },
  },
  {
    id: "cool",
    label: "Cool",
    values: { ...DEFAULT_FILTER_VALUES, warmth: -0.2, tint: -0.1 },
  },
  {
    id: "mono",
    label: "Mono",
    values: { ...DEFAULT_FILTER_VALUES, saturation: -1, contrast: 0.15 },
  },
];

export interface FiltersState {
  filters: FilterValues;
  presetId: string;
  setFilter: (key: keyof FilterValues, value: number) => void;
  applyPreset: (id: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export function useFilters(): FiltersState {
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTER_VALUES);
  const [presetId, setPresetId] = useState("natural");

  const setFilter = useCallback((key: keyof FilterValues, value: number) => {
    const clamped = Math.max(-1, Math.min(1, value));
    setFilters((prev) => ({ ...prev, [key]: clamped }));
    setPresetId("");
  }, []);

  const applyPreset = useCallback((id: string) => {
    const preset = FILTER_PRESETS.find((p) => p.id === id);
    if (preset) {
      setFilters({ ...preset.values });
      setPresetId(id);
    }
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_VALUES);
    setPresetId("natural");
  }, []);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((v) => Math.abs(v) > 0.01),
    [filters],
  );

  return {
    filters,
    presetId,
    setFilter,
    applyPreset,
    resetFilters,
    hasActiveFilters,
  };
}
