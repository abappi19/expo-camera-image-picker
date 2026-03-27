import React from 'react';
import { Modal } from 'react-native';
import { useCameraImagePicker } from '../hooks/useCameraImagePicker';
import { CameraView } from './camera-view';

export function CameraImagePickerModal() {
  const { isOpen, options, closeCamera, setResult, setError, setCapturing, setSupportedFeatures } = useCameraImagePicker();
  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} animationType="slide" presentationStyle="fullScreen" onRequestClose={closeCamera}>
      <CameraView onClose={closeCamera} options={options} onCapture={setResult} setCapturing={setCapturing} setError={setError} setSupportedFeatures={setSupportedFeatures} />
    </Modal>
  );
}
