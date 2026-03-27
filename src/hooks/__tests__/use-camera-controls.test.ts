import { renderHook, act } from "@testing-library/react-native";

import { useCameraControls } from "../use-camera-controls";

jest.mock("react-native-vision-camera", () => ({
  Camera: jest.fn(),
}));

describe("useCameraControls", () => {
  it("initializes with isCapturing false and a camera ref", () => {
    const { result } = renderHook(() => useCameraControls());

    expect(result.current.isCapturing).toBe(false);
    expect(result.current.cameraRef).toBeDefined();
    expect(result.current.cameraRef.current).toBeNull();
  });

  it("returns null when camera ref is not set", async () => {
    const { result } = renderHook(() => useCameraControls());

    let captureResult: any;
    await act(async () => {
      captureResult = await result.current.capture();
    });

    expect(captureResult).toBeNull();
  });

  it("captures photo and returns formatted URI", async () => {
    const mockTakePhoto = jest.fn().mockResolvedValue({
      path: "/tmp/photo-123.jpg",
      width: 1920,
      height: 1080,
    });

    const { result } = renderHook(() => useCameraControls());

    // Simulate camera ref being set
    (result.current.cameraRef as any).current = { takePhoto: mockTakePhoto };

    let captureResult: any;
    await act(async () => {
      captureResult = await result.current.capture();
    });

    expect(mockTakePhoto).toHaveBeenCalledWith({ flash: "off" });
    expect(captureResult).toEqual({
      uri: "file:///tmp/photo-123.jpg",
      width: 1920,
      height: 1080,
      path: "/tmp/photo-123.jpg",
    });
  });

  it("returns null and logs error when takePhoto fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const mockTakePhoto = jest
      .fn()
      .mockRejectedValue(new Error("Camera not ready"));

    const { result } = renderHook(() => useCameraControls());
    (result.current.cameraRef as any).current = { takePhoto: mockTakePhoto };

    let captureResult: any;
    await act(async () => {
      captureResult = await result.current.capture();
    });

    expect(captureResult).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "[CameraControls] Capture failed:",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it("passes flash parameter to takePhoto", async () => {
    const mockTakePhoto = jest.fn().mockResolvedValue({
      path: "/tmp/photo.jpg",
      width: 1080,
      height: 1080,
    });

    const { result } = renderHook(() => useCameraControls());
    (result.current.cameraRef as any).current = { takePhoto: mockTakePhoto };

    await act(async () => {
      await result.current.capture("auto");
    });

    expect(mockTakePhoto).toHaveBeenCalledWith({ flash: "auto" });
  });

  it("resets isCapturing after capture completes", async () => {
    const mockTakePhoto = jest.fn().mockResolvedValue({
      path: "/tmp/photo.jpg",
      width: 1080,
      height: 1080,
    });

    const { result } = renderHook(() => useCameraControls());
    (result.current.cameraRef as any).current = { takePhoto: mockTakePhoto };

    await act(async () => {
      await result.current.capture();
    });

    expect(result.current.isCapturing).toBe(false);
  });
});
