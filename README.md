# expo-camera-image-picker

A custom camera modal and image picker for Expo apps, built on [`react-native-vision-camera`](https://github.com/mrousavy/react-native-vision-camera). Provides a Provider/Hook API with a full-featured camera UI out of the box — aspect ratio switching, zoom controls, flash modes, grid overlay, camera flip animations, and gallery picker.

> **Note:** Expo Go is not compatible with `react-native-vision-camera`. Use a [development build](https://docs.expo.dev/develop/development-builds/introduction/).

## Features

- **Promise-based API** — `openCamera()` returns `{ uri, error }` directly
- **Full camera UI** — shutter, flash, grid, zoom, aspect ratio, camera flip
- **Aspect ratio switching** — 16:9, 4:3, 1:1 with animated corner transitions
- **Zoom controls** — 0.5x, 1x, 2x, 4x with ultra-wide support detection
- **Flash modes** — off, on, auto, torch
- **Grid overlay** — toggleable rule-of-thirds grid
- **Gallery picker** — built-in gallery access via `expo-image-picker`
- **Accent color** — single prop to theme all controls
- **Composable** — use the full modal or individual components for custom UIs
- **TypeScript** — fully typed API and exports

## Installation

```bash
# npm
npm install expo-camera-image-picker

# yarn
yarn add expo-camera-image-picker

# pnpm
pnpm add expo-camera-image-picker
```

### Peer Dependencies

Install the required peer dependencies using Expo's version resolver:

```bash
npx expo install react-native-vision-camera react-native-reanimated react-native-safe-area-context react-native-svg expo-image-picker
```

| Package | Minimum Version |
|---------|-----------------|
| `expo` | * |
| `react` | >= 18 |
| `react-native` | >= 0.74 |
| `react-native-vision-camera` | >= 4 |
| `react-native-reanimated` | >= 3 |
| `react-native-safe-area-context` | >= 4 |
| `react-native-svg` | >= 15 |
| `expo-image-picker` | * |

### Permissions

Add camera and photo library permissions to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-vision-camera",
        {
          "cameraPermissionText": "$(PRODUCT_NAME) needs access to your camera",
          "enableMicrophonePermission": false
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "$(PRODUCT_NAME) needs access to your photos"
        }
      ]
    ]
  }
}
```

## Quick Start

### 1. Wrap your app with the provider

```tsx
import { CameraImagePickerProvider } from 'expo-camera-image-picker';

export default function App() {
  return (
    <CameraImagePickerProvider accentColor="#007AFF">
      {/* your app */}
    </CameraImagePickerProvider>
  );
}
```

### 2. Open the camera from any component

```tsx
import { useCameraImagePicker } from 'expo-camera-image-picker';

function CaptureButton() {
  const { openCamera } = useCameraImagePicker();

  const handleCapture = async () => {
    const response = await openCamera();

    if (response.uri) {
      // Photo captured — response.uri is a local file:// URI
      console.log('Captured:', response.uri);
    } else if (response.error) {
      // Something went wrong
      console.error(response.error);
    } else {
      // User cancelled (uri === null && error === null)
    }
  };

  return <Button title="Take Photo" onPress={handleCapture} />;
}
```

That's it. The provider handles the modal, camera permissions, and cleanup internally.

## API Reference

### `CameraImagePickerProvider`

Wraps your app and manages the camera modal internally. Place it near the root of your component tree.

```tsx
<CameraImagePickerProvider accentColor="#FFFFFF">
  {children}
</CameraImagePickerProvider>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Your app content |
| `accentColor` | `string` | `'#FFFFFF'` | Accent color for shutter ring, icons, and control tints |

### `useCameraImagePicker()`

Hook to access the camera picker. Must be called within `CameraImagePickerProvider`.

```tsx
const { openCamera, accentColor } = useCameraImagePicker();
```

| Return | Type | Description |
|--------|------|-------------|
| `openCamera` | `() => Promise<CameraPickerResponse>` | Opens the camera modal. Resolves when the user captures, cancels, or an error occurs |
| `accentColor` | `string` | The configured accent color |

### `CameraPickerResponse`

The response from `openCamera()` is a discriminated union:

```tsx
// Success — photo captured
{ uri: string; error: null }

// Error — capture failed
{ uri: null; error: string }

// Cancelled — user dismissed the modal
{ uri: null; error: null }
```

### Response Handling Pattern

```tsx
const response = await openCamera();

if (response.uri) {
  // success — use response.uri
} else if (response.error) {
  // error — show response.error
} else {
  // cancelled — no action needed
}
```

## Advanced: Using Individual Components

For fully custom camera UIs, all internal components are exported individually. Build your own layout using the same building blocks:

```tsx
import {
  CameraView,
  ShutterButton,
  AspectRatioSelector,
  ZoomSelector,
  FlashButton,
  GridButton,
  CameraGridOverlay,
} from 'expo-camera-image-picker';
```

### `CameraView`

The full camera experience as a standalone component. Use this when you need to embed the camera directly instead of using the provider modal.

```tsx
<CameraView
  onCapture={(uri) => console.log(uri)}
  onClose={() => navigation.goBack()}
  accentColor="#FF6600"
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onCapture` | `(uri: string) => void` | Yes | Called with local file URI after successful capture |
| `onClose` | `() => void` | Yes | Called when the close button is pressed |
| `onGalleryPress` | `() => void` | No | Custom gallery button handler |
| `onGallerySelect` | `(uris: string[]) => void` | No | Called with selected URIs from gallery picker. Takes priority over `onGalleryPress` |
| `accentColor` | `string` | No | Accent color (default: `'#FFFFFF'`) |
| `style` | `ViewStyle` | No | Style overrides for the root container |

When neither `onGalleryPress` nor `onGallerySelect` is provided, the gallery button opens the built-in picker and passes the selected image through `onCapture`.

### `ShutterButton`

Animated capture button with accent color ring.

```tsx
<ShutterButton
  onPress={handleCapture}
  isCapturing={false}
  accentColor="#FFFFFF"
/>
```

### `AspectRatioSelector`

Expandable pill for switching between 16:9, 4:3, and 1:1.

```tsx
<AspectRatioSelector
  selectedRatio="4:3"
  onSelect={setRatio}
  expanded={expanded}
  onToggle={toggleExpanded}
  accentColor="#FFFFFF"
/>
```

### `ZoomSelector`

Zoom level pills (0.5x, 1x, 2x, 4x) with ultra-wide detection.

```tsx
<ZoomSelector
  selectedZoom="1.0x"
  onSelect={setZoom}
  supportsUltraWide={true}
  accentColor="#FFFFFF"
/>
```

### `FlashButton`

Flash mode selector with expandable options (off, on, auto, torch).

```tsx
<FlashButton
  flashMode="auto"
  onSelect={setFlashMode}
  expanded={expanded}
  onToggle={toggleExpanded}
  supportsFlash={true}
  supportsTorch={true}
  accentColor="#FFFFFF"
/>
```

### `GridButton`

Toggle button for the rule-of-thirds grid overlay.

```tsx
<GridButton
  showGrid={showGrid}
  onToggle={toggleGrid}
  accentColor="#FFFFFF"
/>
```

### `CameraGridOverlay`

Rule-of-thirds grid rendered as an overlay on top of the camera preview.

```tsx
<CameraGridOverlay />
```

## Camera UI Details

### Aspect Ratio Switching

Three aspect ratios with animated corner transitions when switching:

- **16:9** — default, widescreen
- **4:3** — classic photo ratio
- **1:1** — square

The aspect ratio controls the camera preview crop via `resizeMode="cover"` — the full sensor output fills the frame with edges cropped to match the selected ratio.

### Zoom Levels

Four zoom presets with smooth animated transitions:

- **0.5x** — ultra-wide (auto-hidden on devices that don't support it)
- **1.0x** — default
- **2.0x** — telephoto
- **4.0x** — max zoom

### Flash Modes

- **Off** — no flash
- **On** — always flash
- **Auto** — flash when needed
- **Torch** — continuous light

Flash and torch options are detected per-device and hidden when unsupported.

### Gallery Picker

The gallery button (bottom-left of the camera UI) opens the system image picker via `expo-image-picker`. Selected images flow through the same callback as camera captures.

### Permission Handling

The camera view handles permissions automatically:

- Shows a "Grant Permission" button when camera access is not yet granted
- Displays a lock icon with a clear message
- Provides a close button to dismiss without granting
- Shows a simulator fallback with gallery access when no camera device is available

## Types

All types are exported for TypeScript consumers:

```tsx
import type {
  // Provider & Hook
  CameraImagePickerProviderProps,
  CameraPickerContextValue,
  CameraPickerResponse,
  CameraPickerResult,
  CameraPickerError,
  CameraPickerCancelled,
  CameraPickerConfig,

  // Camera component
  CameraViewProps,
  CaptureResult,

  // Utility types
  CameraFacing,    // 'front' | 'back'
  FlashMode,       // 'off' | 'on' | 'auto' | 'torch'
  AspectRatio,     // '16:9' | '4:3' | '1:1'
  ZoomLevel,       // '0.5x' | '1.0x' | '2.0x' | '4.0x'
} from 'expo-camera-image-picker';
```

## Example App

The `example/` directory contains a full Expo Router app demonstrating the library:

```bash
cd example
npm install
npx expo start
```

The example shows provider setup in the root layout, opening the camera with `await openCamera()`, displaying captured images, and handling the response union.

## Development

```bash
yarn install          # install dependencies
yarn typecheck        # TypeScript static analysis
yarn lint             # ESLint with auto-fix
yarn format           # ESLint format
yarn test             # run Jest tests
yarn build            # build with expo-module
```

## License

MIT
