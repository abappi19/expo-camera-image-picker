import type { StyleProp, ViewStyle } from "react-native";

export interface CameraViewProps {
  /** Called with local file URI (file://...) after successful photo capture */
  onCapture: (uri: string) => void;
  /** Called when the close button is pressed */
  onClose: () => void;
  /** Legacy: called when gallery button pressed (simple callback, no picker) */
  onGalleryPress?: () => void;
  /** Called with selected image URIs after gallery picker completes. Takes priority over onGalleryPress. */
  onGallerySelect?: (uris: string[]) => void;
  /** Accent color for shutter ring and icon tints (default: '#FFFFFF') */
  accentColor?: string;
  /** Style overrides for the root container */
  style?: StyleProp<ViewStyle>;
}

export interface CaptureResult {
  /** Local file URI with file:// prefix */
  uri: string;
  /** Photo width in pixels */
  width: number;
  /** Photo height in pixels */
  height: number;
  /** Raw filesystem path (no file:// prefix) */
  path: string;
}
