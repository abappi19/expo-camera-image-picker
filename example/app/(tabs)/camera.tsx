import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useCameraImagePicker, CameraImagePickerModal } from '../../../src';
import type { CameraCaptureResult, CameraPickerOptions } from '../../../src';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

const PRESETS: { label: string; options: CameraPickerOptions }[] = [
  { label: 'Default', options: {} },
  { label: 'Front', options: { cameraFacing: 'front' } },
  { label: '1:1', options: { aspectRatio: '1:1' } },
  { label: '16:9', options: { aspectRatio: '16:9' } },
  { label: 'Grid', options: { showGrid: true } },
  { label: 'Quality', options: { performanceMode: 'quality' } },
  { label: 'Speed', options: { performanceMode: 'speed' } },
  { label: '3s Timer', options: { timerSeconds: 3 } },
  { label: 'EXIF', options: { includeExif: true } },
];

export default function CameraScreen() {
  const { openCamera, result, isCapturing, error } = useCameraImagePicker();
  const [captures, setCaptures] = useState<CameraCaptureResult[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleOpen = (options: CameraPickerOptions) => {
    openCamera(options);
  };

  // Track captures locally (provider onCapture fires globally in _layout)
  const latestUri = result?.uri;
  if (latestUri && !captures.some((c) => c.uri === latestUri)) {
    setCaptures((prev) => [result, ...prev]);
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={styles.title}>
          Camera Picker
        </ThemedText>

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}
        {isCapturing && <ThemedText style={styles.status}>Capturing...</ThemedText>}

        <ThemedText type="subtitle" style={styles.sectionLabel}>
          Open with preset
        </ThemedText>

        <View style={styles.presetGrid}>
          {PRESETS.map((preset) => (
            <Pressable
              key={preset.label}
              onPress={() => handleOpen(preset.options)}
              style={[
                styles.presetButton,
                { backgroundColor: isDark ? '#1c1c1e' : '#f2f2f7', borderColor: isDark ? '#333' : '#ddd' },
              ]}
            >
              <ThemedText style={styles.presetText}>{preset.label}</ThemedText>
            </Pressable>
          ))}
        </View>

        {result && (
          <View style={styles.resultCard}>
            <ThemedText type="subtitle" style={styles.sectionLabel}>
              Last Capture
            </ThemedText>
            <Image source={{ uri: result.uri }} style={styles.preview} />
            <ThemedText style={styles.meta}>
              {result.width ?? '?'}x{result.height ?? '?'}
              {result.presetId ? ` · ${result.presetId}` : ''}
              {result.filters ? ` · brightness ${result.filters.brightness}` : ''}
            </ThemedText>
          </View>
        )}

        {captures.length > 1 && (
          <View>
            <ThemedText type="subtitle" style={styles.sectionLabel}>
              All Captures ({captures.length})
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery}>
              {captures.map((cap, i) => (
                <Image key={`${cap.uri}-${i}`} source={{ uri: cap.uri }} style={styles.thumb} />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <CameraImagePickerModal />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 20,
  },
  error: {
    color: '#ff3b30',
    marginBottom: 8,
  },
  status: {
    color: '#ff9500',
    marginBottom: 8,
  },
  sectionLabel: {
    marginBottom: 12,
    marginTop: 8,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  presetButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 14,
  },
  resultCard: {
    marginBottom: 24,
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    opacity: 0.5,
  },
  gallery: {
    gap: 8,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});
