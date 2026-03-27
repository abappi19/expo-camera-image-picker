import { useCameraPermission } from 'react-native-vision-camera';

export function useCameraPermissions() {
  const { hasPermission, requestPermission } = useCameraPermission();
  return { hasPermission, requestPermission };
}
