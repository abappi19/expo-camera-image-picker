// expo-camera-image-picker
// Standalone, npm-publishable camera UI module
// Zero dependency on app business logic (no NativeWind, no gluestack, no @features/*)
// All styling via plain StyleSheet.create()

// Provider & Hook (public API)
export { CameraImagePickerProvider } from "./provider/CameraImagePickerProvider";
export { useCameraImagePicker } from "./hooks/useCameraImagePicker";

// Core components (for custom camera UIs)
export { CameraView } from "./components/camera-view";
export { ShutterButton } from "./components/shutter-button";
export { AspectRatioSelector } from "./components/aspect-ratio-selector";
export { ZoomSelector } from "./components/zoom-selector";
export { FlashButton } from "./components/flash-button";
export { GridButton } from "./components/grid-button";
export { ToolsButton } from "./components/tools-button";
export { CameraGridOverlay } from "./components/camera-grid-overlay";
export { FocusIndicator } from "./components/focus-indicator";

// Types
export type { CameraViewProps, CaptureResult } from "./types/camera.types";
export type {
  AspectRatio,
  CameraFacing,
  CameraImagePickerProviderProps,
  CameraPickerCancelled,
  CameraPickerConfig,
  CameraPickerContextValue,
  CameraPickerError,
  CameraPickerResponse,
  CameraPickerResult,
  FlashMode,
} from "./types";
export type { ZoomLevel } from "./hooks/use-zoom";
export type {
  FilterValues,
  FilterPreset,
  FiltersState,
} from "./hooks/use-filters";
export type { FocusPoint, TapToFocusState } from "./hooks/use-tap-to-focus";
export { useFilters, FILTER_PRESETS } from "./hooks/use-filters";
export { useTapToFocus } from "./hooks/use-tap-to-focus";
