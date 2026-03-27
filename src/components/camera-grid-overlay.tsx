import React from "react";
import { View, StyleSheet } from "react-native";

export function CameraGridOverlay() {
  return (
    <View
      style={styles.container}
      pointerEvents="none"
      testID="camera-grid-overlay"
    >
      <View style={[styles.line, styles.horizontal, { top: "33.33%" }]} />
      <View style={[styles.line, styles.horizontal, { top: "66.66%" }]} />
      <View style={[styles.line, styles.vertical, { left: "33.33%" }]} />
      <View style={[styles.line, styles.vertical, { left: "66.66%" }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  line: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  horizontal: {
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  vertical: {
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
  },
});
