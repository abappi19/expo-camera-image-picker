import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ZOOM_PRESETS } from '../constants';

export function ZoomSelector({ selectedZoom, onSelect }: { selectedZoom: number; onSelect: (value: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {ZOOM_PRESETS.map((zoom) => (
        <Pressable key={zoom} onPress={() => onSelect(zoom)} style={{ padding: 8, borderRadius: 8, backgroundColor: selectedZoom === zoom ? '#fff' : 'rgba(0,0,0,0.4)' }}>
          <Text style={{ color: selectedZoom === zoom ? '#000' : '#fff' }}>{zoom}x</Text>
        </Pressable>
      ))}
    </View>
  );
}
