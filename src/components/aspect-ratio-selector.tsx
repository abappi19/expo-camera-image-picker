import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../constants';

export function AspectRatioSelector({ selected, onSelect }: { selected: AspectRatio; onSelect: (value: AspectRatio) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {ASPECT_RATIOS.map((ratio) => (
        <Pressable key={ratio} onPress={() => onSelect(ratio)} style={{ padding: 8, borderRadius: 8, backgroundColor: ratio === selected ? '#fff' : 'rgba(0,0,0,0.4)' }}>
          <Text style={{ color: ratio === selected ? '#000' : '#fff' }}>{ratio}</Text>
        </Pressable>
      ))}
    </View>
  );
}
