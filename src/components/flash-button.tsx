import React from 'react';
import { Pressable, Text } from 'react-native';
import type { FlashMode } from '../types';

export function FlashButton({ mode, onCycle }: { mode: FlashMode; onCycle: () => void }) {
  return (
    <Pressable onPress={onCycle} style={{ padding: 8, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <Text style={{ color: '#fff' }}>Flash: {mode}</Text>
    </Pressable>
  );
}
