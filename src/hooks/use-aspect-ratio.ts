import { useMemo, useState } from 'react';
import type { AspectRatio } from '../types';

export function useAspectRatio(initial: AspectRatio = '4:3') {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(initial);
  const ratioValue = useMemo(() => (selectedRatio === '16:9' ? 16 / 9 : selectedRatio === '1:1' ? 1 : 4 / 3), [selectedRatio]);
  return { selectedRatio, setSelectedRatio, ratioValue };
}
