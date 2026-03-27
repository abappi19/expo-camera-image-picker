import React from 'react';
import { StyleSheet, View } from 'react-native';

export function GuideOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.safeFrame} />
      <View style={styles.horizon} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeFrame: { position: 'absolute', left: '10%', right: '10%', top: '18%', bottom: '18%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  horizon: { position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
});
