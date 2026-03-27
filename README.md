# expo-camera-image-picker

JS/TS Expo camera package powered by `react-native-vision-camera`.

## Features

- Internal camera modal with provider + hook trigger API
- Capture, retake, confirm, close
- Camera flip, flash modes, grid, aspect ratio, zoom selector/slider
- Tap-to-focus and exposure control state
- Filter controls (brightness/contrast/saturation/warmth/tint/highlights/shadows)
- Presets + reset, guide overlay toggle, performance degradation policy
- Optional gallery import via `expo-image-picker`

## Install

```bash
npx expo install react-native-vision-camera react-native-reanimated react-native-safe-area-context expo-image-picker
```

Add plugin in app config:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-vision-camera",
        {
          "cameraPermissionText": "Allow $(PRODUCT_NAME) to use the camera"
        }
      ]
    ]
  }
}
```

## Usage

```tsx
import {
  CameraImagePickerProvider,
  CameraImagePickerModal,
  useCameraImagePicker,
} from 'expo-camera-image-picker';

function Screen() {
  const { openCamera, result } = useCameraImagePicker();

  return (
    <>
      <Button title="Open camera" onPress={() => openCamera()} />
      {result && <Image source={{ uri: result.uri }} style={{ width: 80, height: 80 }} />}
      <CameraImagePickerModal />
    </>
  );
}

export default function App() {
  return (
    <CameraImagePickerProvider>
      <Screen />
    </CameraImagePickerProvider>
  );
}
```

## Notes

- Expo Go is not compatible with `react-native-vision-camera`; use a development build.
- Uses current Vision Camera APIs (`Camera`, `useCameraDevice`, `useCameraPermission`) and avoids deprecated camera APIs.
