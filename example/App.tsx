import React, { useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  CameraImagePickerProvider,
  CameraImagePickerModal,
  useCameraImagePicker,
} from '../src';
import type { CameraCaptureResult, CameraPickerOptions } from '../src';

const PRESETS: { label: string; options: CameraPickerOptions }[] = [
  { label: 'Default', options: {} },
  { label: 'Front Camera', options: { cameraFacing: 'front' } },
  { label: 'Square 1:1', options: { aspectRatio: '1:1' } },
  { label: '16:9 Wide', options: { aspectRatio: '16:9' } },
  { label: 'With Grid', options: { showGrid: true } },
  { label: 'Quality Mode', options: { performanceMode: 'quality' } },
  { label: 'Speed Mode', options: { performanceMode: 'speed' } },
  { label: '3s Timer', options: { timerSeconds: 3 } },
  { label: 'With EXIF', options: { includeExif: true } },
];

function Screen() {
  const { openCamera, result, isCapturing, error } = useCameraImagePicker();
  const [captures, setCaptures] = useState<CameraCaptureResult[]>([]);

  const handleCapture = (res: CameraCaptureResult) => {
    setCaptures((prev) => [res, ...prev]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Camera Image Picker</Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {isCapturing && <Text style={styles.status}>Capturing...</Text>}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presets}
      >
        {PRESETS.map((preset) => (
          <Pressable
            key={preset.label}
            onPress={() => openCamera(preset.options)}
            style={styles.presetButton}
          >
            <Text style={styles.presetText}>{preset.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.sectionTitle}>Last Capture</Text>
          <Image source={{ uri: result.uri }} style={styles.preview} />
          <Text style={styles.meta}>
            {result.width}x{result.height}
            {result.presetId ? ` | ${result.presetId}` : ''}
            {result.filters ? ` | brightness: ${result.filters.brightness}` : ''}
          </Text>
        </View>
      )}

      {captures.length > 0 && (
        <View style={styles.gallerySection}>
          <Text style={styles.sectionTitle}>All Captures ({captures.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {captures.map((cap, i) => (
              <Image key={`${cap.uri}-${i}`} source={{ uri: cap.uri }} style={styles.thumb} />
            ))}
          </ScrollView>
        </View>
      )}

      <CameraImagePickerModal />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <CameraImagePickerProvider
      onCapture={(result) => console.log('Captured:', result.uri)}
      onError={(error) => console.warn('Camera error:', error)}
      onCancel={() => console.log('Camera cancelled')}
    >
      <Screen />
    </CameraImagePickerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingTop: 60,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  error: {
    color: '#ff4444',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  status: {
    color: '#ffaa00',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  presets: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 24,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  presetText: {
    color: '#fff',
    fontSize: 14,
  },
  resultCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  meta: {
    color: '#666',
    fontSize: 12,
  },
  gallerySection: {
    marginBottom: 20,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginHorizontal: 4,
    marginLeft: 20,
  },
});
