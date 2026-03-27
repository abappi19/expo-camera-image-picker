// camera-picker module
// Standalone, npm-publishable camera UI module
// Zero dependency on app business logic (no NativeWind, no gluestack, no @features/*)
// All styling via plain StyleSheet.create()

// Provider & Modal (wrapper layer)
export { CameraImagePickerProvider } from './provider/CameraImagePickerProvider';
export { useCameraImagePicker } from './hooks/useCameraImagePicker';
export { CameraImagePickerModal } from './components/CameraModal';

// Core components
export { CameraView } from './components/camera-view';
export { ShutterButton } from './components/shutter-button';
export { AspectRatioSelector } from './components/aspect-ratio-selector';
export { ZoomSelector } from './components/zoom-selector';
export { FlashButton } from './components/flash-button';
export { GridButton } from './components/grid-button';
export { CameraGridOverlay } from './components/camera-grid-overlay';

// Types from reference camera.types
export type { CameraViewProps, CaptureResult } from './types/camera.types';

// Types from extended types
export type {
  AspectRatio,
  CameraCaptureResult,
  CameraFacing,
  CameraPickerOptions,
  FilterPreset,
  FilterValues,
  FlashMode,
  PerformanceMode,
  SupportedFeatures,
} from './types';

// Hook types
export type { ZoomLevel } from './hooks/use-zoom';
