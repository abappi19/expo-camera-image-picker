import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCameraDevice } from 'react-native-vision-camera';
import { DEFAULT_FILTER_VALUES, FILTER_PRESETS } from '../constants';
import { useAnimatedZoom } from '../hooks/use-animated-zoom';
import { useAspectRatio } from '../hooks/use-aspect-ratio';
import { useCameraControls } from '../hooks/use-camera-controls';
import { useCameraPermissions } from '../hooks/use-camera-permissions';
import { useFlash } from '../hooks/use-flash';
import { useGrid } from '../hooks/use-grid';
import { useZoom } from '../hooks/use-zoom';
import { getPerfConfig } from '../utils/performanceMode';
import { mapPhotoResult } from '../utils/resultMapper';
import { resolveSupportedFeatures } from '../vision-camera/capabilities';
import { buildPipelineConfig } from '../vision-camera/pipelineConfig';
import { useFrameProcessorRuntime } from '../vision-camera/frameProcessors';
import type { CameraViewProps, FilterValues } from '../types';
import { CameraControls } from './CameraControls';
import { CameraGridOverlay } from './camera-grid-overlay';
import { FilterPanel } from './FilterPanel';
import { GuideOverlay } from './GuideOverlay';
import { ReanimatedCamera } from './reanimated-camera';

function nextPosition(position: 'front' | 'back') { return position === 'back' ? 'front' : 'back'; }

export function CameraView({ onClose, onCapture, options, setCapturing, setError, setSupportedFeatures }: CameraViewProps) {
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>(options.cameraFacing ?? 'back');
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string>('natural');
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTER_VALUES);
  const [timerCountdown, setTimerCountdown] = useState(0);

  const device = useCameraDevice(cameraFacing);
  const { hasPermission, requestPermission } = useCameraPermissions();
  const { cameraRef, capture, focus, isCapturing } = useCameraControls();
  const { selectedRatio, setSelectedRatio } = useAspectRatio(options.aspectRatio ?? '4:3');
  const { zoom, setZoom, minZoom, maxZoom } = useZoom(options.initialZoom ?? 1, device?.minZoom ?? 0.5, device?.maxZoom ?? 10);
  const animatedZoomProps = useAnimatedZoom(zoom);
  const { flashMode, cycleFlashMode, photoFlash, torchEnabled } = useFlash();
  const { showGrid, toggleGrid } = useGrid(!!options.showGrid);

  const perfConfig = useMemo(() => getPerfConfig(options.performanceMode ?? 'balanced'), [options.performanceMode]);
  const runtime = useFrameProcessorRuntime(filters, perfConfig);
  const pipeline = buildPipelineConfig(filters, perfConfig);

  React.useEffect(() => { setSupportedFeatures(resolveSupportedFeatures(device)); }, [device, setSupportedFeatures]);
  React.useEffect(() => { setCapturing(isCapturing); }, [isCapturing, setCapturing]);

  const applyPreset = (presetId: string) => {
    const preset = FILTER_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;
    setActivePresetId(presetId);
    setFilters(preset.values);
  };

  const handleChangeFilter = (k: keyof FilterValues, next: number) => {
    setActivePresetId('custom');
    setFilters((prev) => ({ ...prev, [k]: next }));
  };

  const handleCapture = async () => {
    try {
      const timer = options.timerSeconds ?? 0;
      if (timer > 0) {
        for (let i = timer; i > 0; i--) {
          setTimerCountdown(i);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        setTimerCountdown(0);
      }

      const photo = await capture({ flash: photoFlash, enableAutoRedEyeReduction: true });
      if (!photo) return;
      const result = mapPhotoResult(photo, filters, activePresetId);
      setCapturedUri(result.uri);
      onCapture(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to capture photo');
    }
  };

  const onFocusAtCenter = async () => {
    try { await focus({ x: 150, y: 200 }); } catch { }
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.fallback}>
        <Text style={styles.fallbackText}>Camera permission required</Text>
        <Pressable onPress={requestPermission} style={styles.fallbackBtn}><Text style={styles.fallbackBtnText}>Grant permission</Text></Pressable>
        <Pressable onPress={onClose}><Text style={styles.closeText}>Close</Text></Pressable>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.fallback}>
        <Text style={styles.fallbackText}>Camera unavailable (simulator/device unsupported)</Text>
        <Pressable onPress={onClose}><Text style={styles.closeText}>Close</Text></Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.previewWrap}>
        {capturedUri ? (
          <Image source={{ uri: capturedUri }} style={StyleSheet.absoluteFill} resizeMode="contain" />
        ) : (
          <ReanimatedCamera ref={cameraRef} style={StyleSheet.absoluteFill} device={device} isActive={!capturedUri} photo zoom={animatedZoomProps.zoom} torch={torchEnabled ? 'on' : 'off'} exposure={pipeline.exposureOffset} />
        )}

        {showGrid ? <CameraGridOverlay /> : null}
        <GuideOverlay visible={perfConfig.enableGuides} />

        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: filters.warmth > 0 ? 'rgba(255,140,0,0.05)' : 'transparent', opacity: runtime.enabled ? pipeline.overlayOpacity : 0 }]} />

        {timerCountdown > 0 ? <View style={styles.timerWrap}><Text style={styles.timerText}>{timerCountdown}</Text></View> : null}

        <View style={styles.filterPanelWrap}><FilterPanel values={filters} onChange={handleChangeFilter} onPreset={applyPreset} presetId={activePresetId} /></View>

        <CameraControls
          flashMode={flashMode}
          onCycleFlash={cycleFlashMode}
          showGrid={showGrid}
          onToggleGrid={toggleGrid}
          selectedRatio={selectedRatio}
          onSelectRatio={setSelectedRatio}
          zoom={zoom}
          onSelectZoom={(value) => setZoom(Math.max(minZoom, Math.min(maxZoom, value)))}
          onCapture={handleCapture}
          onSwapCamera={() => setCameraFacing((prev) => nextPosition(prev))}
          onClose={onClose}
          onRetake={() => setCapturedUri(null)}
          onConfirm={() => capturedUri && onClose()}
          hasPreview={!!capturedUri}
          isCapturing={isCapturing}
        />

        <Pressable style={styles.focusBtn} onPress={onFocusAtCenter}><Text style={styles.focusBtnText}>Focus</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  previewWrap: { flex: 1, backgroundColor: '#000' },
  filterPanelWrap: { position: 'absolute', left: 12, right: 12, top: 60, gap: 8 },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', gap: 10, padding: 24 },
  fallbackText: { color: '#fff', textAlign: 'center' },
  fallbackBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: '#fff' },
  fallbackBtnText: { color: '#000' },
  closeText: { color: '#bbb' },
  focusBtn: { position: 'absolute', right: 14, bottom: 180, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.55)' },
  focusBtnText: { color: '#fff' },
  timerWrap: { position: 'absolute', top: '42%', alignSelf: 'center' },
  timerText: { color: '#fff', fontSize: 48, fontWeight: '700' },
});
