import * as Device from "expo-device";
import { Platform } from "react-native";
import {
    Camera as RealCamera,
    useCameraDevice as realUseCameraDevice,
    useCameraFormat as realUseCameraFormat,
    useCameraPermission as realUseCameraPermission,
} from "react-native-vision-camera";

import {
    MockCamera,
    useMockCameraDevice,
    useMockCameraFormat,
    useMockCameraPermission,
} from "./mock";
export type {
    Camera as CameraType,
    CameraDevice,
    CameraDeviceFormat,
    CameraPosition,
    CameraProps,
} from "react-native-vision-camera";

export const isSimulator = Platform.OS === "ios" && Device.isDevice === false;

export const Camera = isSimulator ? MockCamera : RealCamera;
export const useCameraDevice = isSimulator
    ? (useMockCameraDevice as typeof realUseCameraDevice)
    : realUseCameraDevice;
export const useCameraFormat = isSimulator
    ? (useMockCameraFormat as typeof realUseCameraFormat)
    : realUseCameraFormat;
export const useCameraPermission = isSimulator
    ? (useMockCameraPermission as typeof realUseCameraPermission)
    : realUseCameraPermission;
