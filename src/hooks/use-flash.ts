import { useState } from 'react';
import type { FlashMode } from '../types';

const MODES: FlashMode[] = ['off', 'on', 'auto', 'torch'];

export function useFlash(initialMode: FlashMode = 'off') {
  const [flashMode, setFlashMode] = useState<FlashMode>(initialMode);
  const cycleFlashMode = () => {
    const idx = MODES.indexOf(flashMode);
    setFlashMode(MODES[(idx + 1) % MODES.length]);
  };
  return { flashMode, setFlashMode, cycleFlashMode, torchEnabled: flashMode === 'torch', photoFlash: flashMode === 'torch' ? 'off' : flashMode };
}
