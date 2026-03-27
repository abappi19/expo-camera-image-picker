import React, {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Modal } from "react-native";

import { CameraView } from "../components/camera-view";
import type {
  CameraImagePickerProviderProps,
  CameraPickerContextValue,
  CameraPickerResponse,
} from "../types";

const DEFAULT_ACCENT_COLOR = "#FFFFFF";

export const CameraImagePickerContext =
  createContext<CameraPickerContextValue | null>(null);

export function CameraImagePickerProvider({
  children,
  accentColor = DEFAULT_ACCENT_COLOR,
}: CameraImagePickerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const resolveRef = useRef<((response: CameraPickerResponse) => void) | null>(
    null,
  );

  const openCamera = useCallback((): Promise<CameraPickerResponse> => {
    return new Promise<CameraPickerResponse>((resolve) => {
      resolveRef.current = resolve;
      setIsOpen(true);
    });
  }, []);

  const handleCapture = useCallback((uri: string) => {
    setIsOpen(false);
    resolveRef.current?.({ uri, error: null });
    resolveRef.current = null;
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    resolveRef.current?.({ uri: null, error: null });
    resolveRef.current = null;
  }, []);

  const value = useMemo<CameraPickerContextValue>(
    () => ({ openCamera, accentColor }),
    [openCamera, accentColor],
  );

  return (
    <CameraImagePickerContext.Provider value={value}>
      {children}
      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleClose}
      >
        {isOpen && (
          <CameraView
            onClose={handleClose}
            onCapture={handleCapture}
            accentColor={accentColor}
          />
        )}
      </Modal>
    </CameraImagePickerContext.Provider>
  );
}
