import type { CameraDevice } from 'react-native-vision-camera';
import type { SupportedFeatures } from '../types';
import { DEFAULT_SUPPORTED_FEATURES } from '../constants';

export function resolveSupportedFeatures(device: CameraDevice | undefined): SupportedFeatures {
  if (!device) {
    return DEFAULT_SUPPORTED_FEATURES;
  }

  return {
    flash: !!device.hasFlash,
    torch: !!device.hasTorch,
    focus: true,
    exposure: true,
    ultraWide: device.minZoom < 1,
    filters: true,
    horizonGuide: true,
  };
}
