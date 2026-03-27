import { useState, useCallback } from 'react';

export interface GridState {
  showGrid: boolean;
  toggleGrid: () => void;
}

export function useGrid(): GridState {
  const [showGrid, setShowGrid] = useState(false);

  const toggleGrid = useCallback(() => {
    setShowGrid((prev) => !prev);
  }, []);

  return { showGrid, toggleGrid };
}
