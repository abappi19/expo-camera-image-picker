import React from 'react';
import { StyleSheet, View } from 'react-native';

export function CameraGridOverlay() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.vertical, { left: '33.33%' }]} />
      <View style={[styles.vertical, { left: '66.66%' }]} />
      <View style={[styles.horizontal, { top: '33.33%' }]} />
      <View style={[styles.horizontal, { top: '66.66%' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  vertical: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  horizontal: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
});
