import { useState } from 'react';

export function useGrid(initial = false) {
  const [showGrid, setShowGrid] = useState(initial);
  return { showGrid, toggleGrid: () => setShowGrid((prev) => !prev), setShowGrid };
}
