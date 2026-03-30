import React, { forwardRef, useContext, useImperativeHandle } from "react";
import { View, StyleSheet } from "react-native";
import type {
  CameraDevice,
  CameraDeviceFormat,
} from "react-native-vision-camera";

import { MOCK_PHOTO_BASE64 } from "./mock-photo.base64";
import { CameraImagePickerContext } from "../../provider/context";

const MOCK_FORMAT = {
  photoWidth: 4032,
  photoHeight: 3024,
  videoWidth: 1920,
  videoHeight: 1080,
  maxISO: 3200,
  minISO: 25,
  maxFps: 60,
  minFps: 1,
  fieldOfView: 73.5,
  supportsPhotoHDR: true,
  supportsVideoHDR: false,
  autoFocusSystem: "contrast-detect",
  videoStabilizationModes: ["auto"],
} as unknown as CameraDeviceFormat;

const MOCK_BACK_DEVICE = {
  id: "mock-back-camera",
  name: "Mock Back Camera",
  position: "back",
  hasFlash: true,
  hasTorch: true,
  isMultiCam: false,
  minZoom: 1,
  maxZoom: 16,
  neutralZoom: 1,
  minExposure: -8,
  maxExposure: 8,
  supportsLowLightBoost: false,
  supportsFocus: true,
  formats: [MOCK_FORMAT],
} as unknown as CameraDevice;

const MOCK_FRONT_DEVICE = {
  ...MOCK_BACK_DEVICE,
  id: "mock-front-camera",
  name: "Mock Front Camera",
  position: "front",
  maxZoom: 8,
} as unknown as CameraDevice;

export const MockCamera = forwardRef(function MockCamera(props: any, ref: any) {
  const ctx = useContext(CameraImagePickerContext);

  useImperativeHandle(ref, () => ({
    async takePhoto() {
      const path = await ctx?.simulatorConfig?.onMockCapture(MOCK_PHOTO_BASE64);
      return {
        path: path ?? "",
        width: 480,
        height: 640,
        isRawPhoto: false,
        orientation: "portrait",
        isMirrored: false,
      };
    },
    async focus() {
      // no-op
    },
  }));

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: "#1a1a2e" },
        props.style,
      ]}
    />
  );
});

export function useMockCameraDevice(position: "back" | "front"): CameraDevice {
  return position === "front" ? MOCK_FRONT_DEVICE : MOCK_BACK_DEVICE;
}

export function useMockCameraFormat(
  _device: CameraDevice | undefined,
  _filters?: unknown[],
): CameraDeviceFormat | undefined {
  return _device ? _device.formats[0] : undefined;
}

export function useMockCameraPermission() {
  return {
    hasPermission: true as boolean,
    requestPermission: async (): Promise<boolean> => true,
  };
}
