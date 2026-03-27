import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { FILTER_PRESETS } from '../constants';
import type { FilterValues } from '../types';

const KEYS: Array<keyof FilterValues> = ['brightness','contrast','saturation','warmth','tint','highlights','shadows'];

export function FilterPanel({ values, onChange, onPreset, presetId }: { values: FilterValues; onChange: (k: keyof FilterValues, next: number) => void; onPreset: (id: string) => void; presetId?: string }) {
  return (
    <View style={{ gap: 8 }}>
      <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
        {FILTER_PRESETS.map((preset) => (
          <Pressable key={preset.id} onPress={() => onPreset(preset.id)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: preset.id === presetId ? '#fff' : 'rgba(0,0,0,0.5)' }}>
            <Text style={{ color: preset.id === presetId ? '#000' : '#fff' }}>{preset.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {KEYS.map((key) => (
          <Pressable key={key} onPress={() => onChange(key, Math.max(-1, Math.min(1, values[key] + 0.1)))} style={{ paddingHorizontal: 8, paddingVertical: 6, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontSize: 12 }}>{key}: {values[key].toFixed(1)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
