import { useMemo } from 'react';

export function useAnimatedZoom(zoom: number) {
  return useMemo(() => ({ zoom }), [zoom]);
}
