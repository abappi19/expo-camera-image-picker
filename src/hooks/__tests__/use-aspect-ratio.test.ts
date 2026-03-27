import { renderHook, act } from "@testing-library/react-native";

import { useAspectRatio } from "../use-aspect-ratio";

const mockUseCameraFormat = jest.fn();

jest.mock("react-native-vision-camera", () => ({
  useCameraFormat: (...args: any[]) => mockUseCameraFormat(...args),
}));

const mockDevice = { id: "back-camera" } as any;
const mockFormat = { photoWidth: 1920, photoHeight: 1080 } as any;

beforeEach(() => {
  jest.clearAllMocks();
  mockUseCameraFormat.mockReturnValue(mockFormat);
});

describe("useAspectRatio", () => {
  it("defaults to 16:9 ratio", () => {
    const { result } = renderHook(() => useAspectRatio(mockDevice));

    expect(result.current.selectedRatio).toBe("16:9");
    expect(result.current.ratioValue).toBeCloseTo(16 / 9);
  });

  it("calls useCameraFormat with correct ratio value", () => {
    renderHook(() => useAspectRatio(mockDevice));

    expect(mockUseCameraFormat).toHaveBeenCalledWith(mockDevice, [
      { photoAspectRatio: 16 / 9 },
    ]);
  });

  it("returns format from useCameraFormat", () => {
    const { result } = renderHook(() => useAspectRatio(mockDevice));
    expect(result.current.format).toBe(mockFormat);
  });

  it("updates ratio when setSelectedRatio is called", () => {
    const { result } = renderHook(() => useAspectRatio(mockDevice));

    act(() => {
      result.current.setSelectedRatio("4:3");
    });

    expect(result.current.selectedRatio).toBe("4:3");
    expect(result.current.ratioValue).toBeCloseTo(4 / 3);
  });

  it("passes 1:1 ratio value correctly", () => {
    const { result } = renderHook(() => useAspectRatio(mockDevice));

    act(() => {
      result.current.setSelectedRatio("1:1");
    });

    expect(result.current.ratioValue).toBe(1);
  });

  it("handles undefined device gracefully", () => {
    mockUseCameraFormat.mockReturnValue(undefined);
    const { result } = renderHook(() => useAspectRatio(undefined));

    expect(result.current.format).toBeUndefined();
    expect(mockUseCameraFormat).toHaveBeenCalledWith(undefined, [
      { photoAspectRatio: 16 / 9 },
    ]);
  });
});
