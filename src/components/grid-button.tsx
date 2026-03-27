import React from 'react';
import { Pressable, Text } from 'react-native';

export function GridButton({ showGrid, onToggle }: { showGrid: boolean; onToggle: () => void }) {
  return (
    <Pressable onPress={onToggle} style={{ padding: 8, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <Text style={{ color: '#fff' }}>{showGrid ? 'Grid On' : 'Grid Off'}</Text>
    </Pressable>
  );
}
