import type { StyleProp, ViewStyle } from 'react-native';

export type CameraFacing = 'front' | 'back';
export type FlashMode = 'off' | 'on' | 'auto' | 'torch';
export type AspectRatio = '16:9' | '4:3' | '1:1';
export type PerformanceMode = 'quality' | 'balanced' | 'speed';

export interface FilterValues {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  tint: number;
  highlights: number;
  shadows: number;
}

export interface FilterPreset {
  id: string;
  label: string;
  values: FilterValues;
}

export interface CameraPickerOptions {
  cameraFacing?: CameraFacing;
  aspectRatio?: AspectRatio;
  initialZoom?: number;
  showGrid?: boolean;
  timerSeconds?: 0 | 3 | 10;
  quality?: number;
  includeExif?: boolean;
  performanceMode?: PerformanceMode;
  maxResolution?: { width: number; height: number };
}

export interface CameraCaptureResult {
  uri: string;
  width?: number;
  height?: number;
  exif?: Record<string, unknown>;
  filters?: FilterValues;
  presetId?: string;
}

export interface SupportedFeatures {
  flash: boolean;
  torch: boolean;
  focus: boolean;
  exposure: boolean;
  ultraWide: boolean;
  filters: boolean;
  horizonGuide: boolean;
}

export interface CameraPickerContextValue {
  isOpen: boolean;
  isCapturing: boolean;
  result: CameraCaptureResult | null;
  error: string | null;
  options: CameraPickerOptions;
  supportedFeatures: SupportedFeatures;
  openCamera: (options?: CameraPickerOptions) => void;
  closeCamera: () => void;
  setCapturing: (value: boolean) => void;
  setResult: (result: CameraCaptureResult | null) => void;
  setError: (error: string | null) => void;
  setSupportedFeatures: (features: SupportedFeatures) => void;
}

export interface CameraImagePickerProviderProps {
  children: React.ReactNode;
  defaultOptions?: CameraPickerOptions;
  onOpen?: () => void;
  onCancel?: () => void;
  onCapture?: (result: CameraCaptureResult) => void;
  onError?: (error: string) => void;
}

export interface CameraViewProps {
  onClose: () => void;
  onCapture: (result: CameraCaptureResult) => void;
  options: CameraPickerOptions;
  setCapturing: (value: boolean) => void;
  setError: (error: string | null) => void;
  setSupportedFeatures: (features: SupportedFeatures) => void;
  style?: StyleProp<ViewStyle>;
}
