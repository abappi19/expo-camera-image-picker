import { useEffect, useState } from "react";
import { useCameraPermission } from "react-native-vision-camera";

export interface CameraPermissionState {
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  isLoading: boolean;
}

export function useCameraPermissions(): CameraPermissionState {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isLoading, setIsLoading] = useState(!hasPermission);

  useEffect(() => {
    if (!hasPermission) {
      setIsLoading(true);
      requestPermission().finally(() => setIsLoading(false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { hasPermission, requestPermission, isLoading };
}
