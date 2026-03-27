import { renderHook, waitFor } from "@testing-library/react-native";

import { useCameraPermissions } from "../use-camera-permissions";

const mockRequestPermission = jest.fn();

jest.mock("react-native-vision-camera", () => ({
  useCameraPermission: jest.fn(() => ({
    hasPermission: false,
    requestPermission: mockRequestPermission,
  })),
}));

const { useCameraPermission: mockUseCameraPermission } = jest.requireMock(
  "react-native-vision-camera",
);

beforeEach(() => {
  jest.clearAllMocks();
  mockRequestPermission.mockResolvedValue(true);
});

describe("useCameraPermissions", () => {
  it("auto-requests permission on mount when not granted", async () => {
    renderHook(() => useCameraPermissions());

    await waitFor(() => {
      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
    });
  });

  it("returns isLoading true while permission is being requested", () => {
    mockRequestPermission.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useCameraPermissions());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasPermission).toBe(false);
  });

  it("does not auto-request when already granted", () => {
    (mockUseCameraPermission as jest.Mock).mockReturnValue({
      hasPermission: true,
      requestPermission: mockRequestPermission,
    });

    const { result } = renderHook(() => useCameraPermissions());

    expect(result.current.hasPermission).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(mockRequestPermission).not.toHaveBeenCalled();
  });

  it("sets isLoading false after permission resolves", async () => {
    mockRequestPermission.mockResolvedValue(true);

    const { result } = renderHook(() => useCameraPermissions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
