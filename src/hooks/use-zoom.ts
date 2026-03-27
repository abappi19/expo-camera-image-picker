import { useMemo, useState } from 'react';

export function useZoom(initial = 1, minZoom = 0.5, maxZoom = 10) {
  const [zoom, setZoom] = useState(initial);
  const clampedZoom = useMemo(() => Math.max(minZoom, Math.min(maxZoom, zoom)), [zoom, minZoom, maxZoom]);
  return { zoom: clampedZoom, setZoom, minZoom, maxZoom };
}
