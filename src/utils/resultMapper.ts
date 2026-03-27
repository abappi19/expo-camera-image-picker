import type { PhotoFile } from 'react-native-vision-camera';
import type { CameraCaptureResult, FilterValues } from '../types';

export function mapPhotoResult(photo: PhotoFile, filters: FilterValues, presetId?: string): CameraCaptureResult {
  const uri = photo.path.startsWith('file://') ? photo.path : `file://${photo.path}`;
  return {
    uri,
    width: photo.width,
    height: photo.height,
    filters,
    presetId,
  };
}
