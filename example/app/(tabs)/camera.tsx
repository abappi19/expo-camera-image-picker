import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useCameraImagePicker } from 'expo-camera-image-picker';
import type { CameraPickerResult } from 'expo-camera-image-picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CameraScreen() {
  const { openCamera } = useCameraImagePicker();
  const [captures, setCaptures] = useState<CameraPickerResult[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleOpen = async () => {
    setLastError(null);
    const response = await openCamera();

    if (response.error) {
      setLastError(response.error);
    } else if (response.uri) {
      setCaptures((prev) => [response, ...prev]);
    }
  };

  const latestCapture = captures[0] ?? null;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={styles.title}>
          Camera Picker
        </ThemedText>

        {lastError && <ThemedText style={styles.error}>{lastError}</ThemedText>}

        <Pressable
          onPress={handleOpen}
          style={[
            styles.openButton,
            { backgroundColor: isDark ? '#1c1c1e' : '#f2f2f7', borderColor: isDark ? '#333' : '#ddd' },
          ]}
        >
          <ThemedText style={styles.openButtonText}>Open Camera</ThemedText>
        </Pressable>

        {latestCapture && (
          <View style={styles.resultCard}>
            <ThemedText type="subtitle" style={styles.sectionLabel}>
              Last Capture
            </ThemedText>
            <Pressable onPress={() => setPreviewUri(latestCapture.uri)}>
              <Image source={{ uri: latestCapture.uri }} style={styles.preview} />
            </Pressable>
          </View>
        )}

        {captures.length > 1 && (
          <View>
            <ThemedText type="subtitle" style={styles.sectionLabel}>
              All Captures ({captures.length})
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery}>
              {captures.map((cap, i) => (
                <Pressable key={`${cap.uri}-${i}`} onPress={() => setPreviewUri(cap.uri)}>
                  <Image source={{ uri: cap.uri }} style={styles.thumb} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <Modal visible={!!previewUri} animationType="fade" transparent statusBarTranslucent>
        <Pressable style={styles.previewOverlay} onPress={() => setPreviewUri(null)}>
          {previewUri && (
            <Image source={{ uri: previewUri }} style={styles.fullImage} resizeMode="contain" />
          )}
          <View style={styles.closeHint}>
            <ThemedText style={styles.closeHintText}>Tap to close</ThemedText>
          </View>
        </Pressable>
      </Modal>
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
  sectionLabel: {
    marginBottom: 12,
    marginTop: 8,
  },
  openButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 24,
  },
  openButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  gallery: {
    gap: 8,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  closeHint: {
    position: 'absolute',
    bottom: 60,
  },
  closeHintText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
});
