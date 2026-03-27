import React, { createContext, useMemo, useState } from 'react';
import { DEFAULT_SUPPORTED_FEATURES } from '../constants';
import { mergeOptions } from '../vision-camera/adapter';
import type {
  CameraCaptureResult,
  CameraImagePickerProviderProps,
  CameraPickerContextValue,
  CameraPickerOptions,
  SupportedFeatures,
} from '../types';

const DEFAULT_OPTIONS: CameraPickerOptions = {
  cameraFacing: 'back',
  aspectRatio: '4:3',
  initialZoom: 1,
  showGrid: false,
  timerSeconds: 0,
  quality: 1,
  includeExif: false,
  performanceMode: 'balanced',
};

export const CameraImagePickerContext = createContext<CameraPickerContextValue | null>(null);

export function CameraImagePickerProvider({ children, defaultOptions, onOpen, onCancel, onCapture, onError }: CameraImagePickerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCapturing, setCapturing] = useState(false);
  const [result, setResult] = useState<CameraCaptureResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [supportedFeatures, setSupportedFeatures] = useState<SupportedFeatures>(DEFAULT_SUPPORTED_FEATURES);
  const [options, setOptions] = useState<CameraPickerOptions>(mergeOptions(DEFAULT_OPTIONS, defaultOptions));

  const openCamera = (incoming?: CameraPickerOptions) => {
    setError(null);
    setOptions((prev) => mergeOptions(prev, incoming));
    setIsOpen(true);
    onOpen?.();
  };

  const closeCamera = () => {
    setIsOpen(false);
    onCancel?.();
  };

  const handleSetError = (value: string | null) => {
    setError(value);
    if (value) onError?.(value);
  };

  const handleSetResult = (value: CameraCaptureResult | null) => {
    setResult(value);
    if (value) {
      onCapture?.(value);
      setIsOpen(false);
    }
  };

  const value = useMemo<CameraPickerContextValue>(
    () => ({
      isOpen,
      isCapturing,
      result,
      error,
      options,
      supportedFeatures,
      openCamera,
      closeCamera,
      setCapturing,
      setResult: handleSetResult,
      setError: handleSetError,
      setSupportedFeatures,
    }),
    [error, isCapturing, isOpen, options, result, supportedFeatures]
  );

  return <CameraImagePickerContext.Provider value={value}>{children}</CameraImagePickerContext.Provider>;
}
