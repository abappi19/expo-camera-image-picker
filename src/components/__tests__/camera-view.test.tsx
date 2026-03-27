import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { CameraView } from "../camera-view";

// Mock ReanimatedCamera component
jest.mock("../reanimated-camera", () => {
  const { forwardRef } = require("react");
  const { View } = require("react-native");
  return {
    ReanimatedCamera: forwardRef((props: any, ref: any) => (
      <View testID="camera-preview" ref={ref} {...props} />
    )),
  };
});

// Mock vision camera
const mockUseCameraDevice = jest.fn();

jest.mock("react-native-vision-camera", () => ({
  useCameraDevice: (...args: any[]) => mockUseCameraDevice(...args),
  useCameraPermission: jest.fn(),
  useCameraFormat: jest.fn().mockReturnValue(undefined),
}));

// Mock aspect ratio hook
const mockSetSelectedRatio = jest.fn();
jest.mock("../../hooks/use-aspect-ratio", () => ({
  useAspectRatio: () => ({
    selectedRatio: "16:9",
    setSelectedRatio: mockSetSelectedRatio,
    format: undefined,
    ratioValue: 16 / 9,
  }),
}));

// Mock zoom hook
const mockSetSelectedZoom = jest.fn();
jest.mock("../../hooks/use-zoom", () => ({
  useZoom: () => ({
    selectedZoom: "1.0x",
    setSelectedZoom: mockSetSelectedZoom,
    zoomValue: 1,
    supportsUltraWide: true,
  }),
}));

// Mock animated zoom hook
jest.mock("../../hooks/use-animated-zoom", () => ({
  useAnimatedZoom: () => ({ zoom: 1 }),
}));

// Mock grid hook
const mockToggleGrid = jest.fn();
jest.mock("../../hooks/use-grid", () => ({
  useGrid: () => ({
    showGrid: false,
    toggleGrid: mockToggleGrid,
  }),
}));

// Mock flash hook
const mockCycleFlashMode = jest.fn();
jest.mock("../../hooks/use-flash", () => ({
  useFlash: () => ({
    flashMode: "off",
    cycleFlashMode: mockCycleFlashMode,
    torchEnabled: false,
    photoFlash: "off",
    supportsFlash: true,
    supportsTorch: true,
  }),
}));

// Mock gallery picker hook
const mockPickFromGallery = jest.fn();
jest.mock("../../hooks/use-gallery-picker", () => ({
  useGalleryPicker: () => ({
    pickFromGallery: mockPickFromGallery,
  }),
}));

// Mock our custom permissions hook for direct control
const mockUseCameraPermissions = jest.fn();
jest.mock("../../hooks/use-camera-permissions", () => ({
  useCameraPermissions: () => mockUseCameraPermissions(),
}));

const mockRequestPermission = jest.fn().mockResolvedValue(true);

const defaultProps = {
  onCapture: jest.fn(),
  onClose: jest.fn(),
  onGalleryPress: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseCameraPermissions.mockReturnValue({
    hasPermission: true,
    requestPermission: mockRequestPermission,
    isLoading: false,
  });
  mockUseCameraDevice.mockReturnValue({ id: "back-camera" });
});

describe("CameraView", () => {
  describe("with camera device available", () => {
    it("renders camera preview", () => {
      const { getByTestId } = render(<CameraView {...defaultProps} />);
      expect(getByTestId("camera-preview")).toBeTruthy();
    });

    it("renders close button that calls onClose", () => {
      const { getByLabelText } = render(<CameraView {...defaultProps} />);
      fireEvent.press(getByLabelText("Close camera"));
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("renders gallery button that calls onGalleryPress", () => {
      const { getByLabelText } = render(<CameraView {...defaultProps} />);
      fireEvent.press(getByLabelText("Open gallery"));
      expect(defaultProps.onGalleryPress).toHaveBeenCalledTimes(1);
    });

    it("does not render gallery button when onGalleryPress is not provided", () => {
      const { queryByLabelText } = render(
        <CameraView onCapture={jest.fn()} onClose={jest.fn()} />,
      );
      expect(queryByLabelText("Open gallery")).toBeNull();
    });

    it("renders shutter button", () => {
      const { getByLabelText } = render(<CameraView {...defaultProps} />);
      expect(getByLabelText("Take photo")).toBeTruthy();
    });

    it("renders aspect ratio selector", () => {
      const { getByLabelText } = render(<CameraView {...defaultProps} />);
      expect(getByLabelText("Aspect ratio 16:9")).toBeTruthy();
      expect(getByLabelText("Aspect ratio 4:3")).toBeTruthy();
      expect(getByLabelText("Aspect ratio 1:1")).toBeTruthy();
    });

    it("renders flash button", () => {
      const { getByLabelText } = render(<CameraView {...defaultProps} />);
      expect(getByLabelText("Flash: off")).toBeTruthy();
    });

    it("renders zoom selector", () => {
      const { getByLabelText } = render(<CameraView {...defaultProps} />);
      expect(getByLabelText("Zoom 0.5x")).toBeTruthy();
      expect(getByLabelText("Zoom 1.0x")).toBeTruthy();
      expect(getByLabelText("Zoom 2.0x")).toBeTruthy();
      expect(getByLabelText("Zoom 4.0x")).toBeTruthy();
    });

    it("renders grid button", () => {
      const { getByLabelText } = render(<CameraView {...defaultProps} />);
      expect(getByLabelText("Grid: off")).toBeTruthy();
    });
  });

  describe("simulator fallback (no device)", () => {
    beforeEach(() => {
      mockUseCameraDevice.mockReturnValue(undefined);
    });

    it("shows simulator message when no camera device", () => {
      const { getByText } = render(<CameraView {...defaultProps} />);
      expect(getByText("Camera unavailable in simulator")).toBeTruthy();
      expect(getByText("Use Gallery to select photos")).toBeTruthy();
    });

    it("renders gallery button in simulator mode", () => {
      const { getByLabelText } = render(<CameraView {...defaultProps} />);
      fireEvent.press(getByLabelText("Open gallery"));
      expect(defaultProps.onGalleryPress).toHaveBeenCalledTimes(1);
    });

    it("renders close button in simulator mode", () => {
      const { getByLabelText } = render(<CameraView {...defaultProps} />);
      fireEvent.press(getByLabelText("Close camera"));
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("does not render camera preview", () => {
      const { queryByTestId } = render(<CameraView {...defaultProps} />);
      expect(queryByTestId("camera-preview")).toBeNull();
    });
  });

  describe("gallery integration", () => {
    it("calls onGallerySelect and onClose when picker returns URIs", async () => {
      const onGallerySelect = jest.fn();
      const onClose = jest.fn();
      mockPickFromGallery.mockResolvedValue([
        "file://photo1.jpg",
        "file://photo2.jpg",
      ]);

      const { getByLabelText } = render(
        <CameraView
          onCapture={jest.fn()}
          onClose={onClose}
          onGallerySelect={onGallerySelect}
        />,
      );

      await fireEvent.press(getByLabelText("Open gallery"));

      expect(mockPickFromGallery).toHaveBeenCalledTimes(1);
      expect(onGallerySelect).toHaveBeenCalledWith([
        "file://photo1.jpg",
        "file://photo2.jpg",
      ]);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onGallerySelect or onClose when picker returns null (cancelled)", async () => {
      const onGallerySelect = jest.fn();
      const onClose = jest.fn();
      mockPickFromGallery.mockResolvedValue(null);

      const { getByLabelText } = render(
        <CameraView
          onCapture={jest.fn()}
          onClose={onClose}
          onGallerySelect={onGallerySelect}
        />,
      );

      await fireEvent.press(getByLabelText("Open gallery"));

      expect(mockPickFromGallery).toHaveBeenCalledTimes(1);
      expect(onGallerySelect).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });

    it("prefers onGallerySelect over onGalleryPress when both provided", async () => {
      const onGallerySelect = jest.fn();
      const onGalleryPress = jest.fn();
      mockPickFromGallery.mockResolvedValue(["file://photo.jpg"]);

      const { getByLabelText } = render(
        <CameraView
          onCapture={jest.fn()}
          onClose={jest.fn()}
          onGalleryPress={onGalleryPress}
          onGallerySelect={onGallerySelect}
        />,
      );

      await fireEvent.press(getByLabelText("Open gallery"));

      expect(onGallerySelect).toHaveBeenCalledWith(["file://photo.jpg"]);
      expect(onGalleryPress).not.toHaveBeenCalled();
    });

    it("shows gallery button when onGallerySelect is provided (no onGalleryPress)", () => {
      const { getByLabelText } = render(
        <CameraView
          onCapture={jest.fn()}
          onClose={jest.fn()}
          onGallerySelect={jest.fn()}
        />,
      );

      expect(getByLabelText("Open gallery")).toBeTruthy();
    });
  });

  describe("permission states", () => {
    it("shows permission request UI when permission denied", () => {
      mockUseCameraPermissions.mockReturnValue({
        hasPermission: false,
        requestPermission: mockRequestPermission,
        isLoading: false,
      });

      const { getByText } = render(<CameraView {...defaultProps} />);
      expect(getByText("Camera permission required")).toBeTruthy();
    });

    it("shows loading state during permission request", () => {
      mockUseCameraPermissions.mockReturnValue({
        hasPermission: false,
        requestPermission: mockRequestPermission,
        isLoading: true,
      });

      const { getByText } = render(<CameraView {...defaultProps} />);
      expect(getByText("Requesting camera access...")).toBeTruthy();
    });
  });
});
