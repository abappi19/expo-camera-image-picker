import { useContext } from 'react';
import { CameraImagePickerContext } from '../provider/CameraImagePickerProvider';

export function useCameraImagePicker() {
  const context = useContext(CameraImagePickerContext);
  if (!context) throw new Error('useCameraImagePicker must be used within CameraImagePickerProvider');
  return context;
}
