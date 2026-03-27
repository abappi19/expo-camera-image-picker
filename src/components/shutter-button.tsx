import React from 'react';
import { Pressable, View } from 'react-native';

export function ShutterButton({ onPress, disabled }: { onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
      <View style={{ width: 76, height: 76, borderRadius: 40, borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 58, height: 58, borderRadius: 30, backgroundColor: '#fff' }} />
      </View>
    </Pressable>
  );
}
