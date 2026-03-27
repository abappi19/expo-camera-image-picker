export type CameraFacing = "front" | "back";
export type FlashMode = "off" | "on" | "auto" | "torch";
export type AspectRatio = "16:9" | "4:3" | "1:1";

export interface CameraPickerResult {
  /** Local file URI (file://...) */
  uri: string;
  /** Error message if capture failed */
  error: null;
}

export interface CameraPickerError {
  uri: null;
  /** Error message */
  error: string;
}

export interface CameraPickerCancelled {
  uri: null;
  error: null;
}

export type CameraPickerResponse =
  | CameraPickerResult
  | CameraPickerError
  | CameraPickerCancelled;

export interface CameraPickerConfig {
  /** Accent color for shutter ring and icon tints (default: '#FFFFFF') */
  accentColor?: string;
}

export interface CameraImagePickerProviderProps {
  children: React.ReactNode;
  /** Accent color for shutter ring and icon tints (default: '#FFFFFF') */
  accentColor?: string;
}

export interface CameraPickerContextValue {
  openCamera: () => Promise<CameraPickerResponse>;
  accentColor: string;
}
