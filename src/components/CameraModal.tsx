import React from 'react';
import { Modal } from 'react-native';
import { useCameraImagePicker } from '../hooks/useCameraImagePicker';
import { CameraView } from './camera-view';

export function CameraImagePickerModal() {
  const { isOpen, closeCamera, setResult } = useCameraImagePicker();
  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} animationType="slide" presentationStyle="fullScreen" onRequestClose={closeCamera}>
      <CameraView
        onClose={closeCamera}
        onCapture={(uri) => {
          setResult({ uri });
        }}
      />
    </Modal>
  );
}
