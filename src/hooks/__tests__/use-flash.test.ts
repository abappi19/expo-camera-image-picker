import { renderHook, act } from "@testing-library/react-native";

import { useFlash } from "../use-flash";

jest.mock("react-native-vision-camera", () => ({}));

const mockDevice = {
  id: "back-camera",
  hasFlash: true,
  hasTorch: true,
} as any;

describe("useFlash", () => {
  it("defaults to off", () => {
    const { result } = renderHook(() => useFlash(mockDevice));
    expect(result.current.flashMode).toBe("off");
  });

  it("cycles Off → On → Auto → Torch → Off", () => {
    const { result } = renderHook(() => useFlash(mockDevice));

    act(() => result.current.cycleFlashMode());
    expect(result.current.flashMode).toBe("on");

    act(() => result.current.cycleFlashMode());
    expect(result.current.flashMode).toBe("auto");

    act(() => result.current.cycleFlashMode());
    expect(result.current.flashMode).toBe("torch");

    act(() => result.current.cycleFlashMode());
    expect(result.current.flashMode).toBe("off");
  });

  it("skips torch when device has no torch", () => {
    const noTorch = { ...mockDevice, hasTorch: false } as any;
    const { result } = renderHook(() => useFlash(noTorch));

    act(() => result.current.cycleFlashMode()); // off → on
    act(() => result.current.cycleFlashMode()); // on → auto
    act(() => result.current.cycleFlashMode()); // auto → off (skip torch)
    expect(result.current.flashMode).toBe("off");
  });

  it("returns torchEnabled true only in torch mode", () => {
    const { result } = renderHook(() => useFlash(mockDevice));

    expect(result.current.torchEnabled).toBe(false);

    act(() => result.current.cycleFlashMode()); // on
    expect(result.current.torchEnabled).toBe(false);

    act(() => result.current.cycleFlashMode()); // auto
    expect(result.current.torchEnabled).toBe(false);

    act(() => result.current.cycleFlashMode()); // torch
    expect(result.current.torchEnabled).toBe(true);
  });

  it("returns correct photoFlash for each mode", () => {
    const { result } = renderHook(() => useFlash(mockDevice));

    expect(result.current.photoFlash).toBe("off"); // off

    act(() => result.current.cycleFlashMode());
    expect(result.current.photoFlash).toBe("on"); // on

    act(() => result.current.cycleFlashMode());
    expect(result.current.photoFlash).toBe("auto"); // auto

    act(() => result.current.cycleFlashMode());
    expect(result.current.photoFlash).toBe("off"); // torch → off (LED already on)
  });

  it("reports supportsFlash from device", () => {
    const { result } = renderHook(() => useFlash(mockDevice));
    expect(result.current.supportsFlash).toBe(true);

    const noFlash = { ...mockDevice, hasFlash: false } as any;
    const { result: r2 } = renderHook(() => useFlash(noFlash));
    expect(r2.current.supportsFlash).toBe(false);
  });

  it("reports supportsTorch from device", () => {
    const { result } = renderHook(() => useFlash(mockDevice));
    expect(result.current.supportsTorch).toBe(true);

    const noTorch = { ...mockDevice, hasTorch: false } as any;
    const { result: r2 } = renderHook(() => useFlash(noTorch));
    expect(r2.current.supportsTorch).toBe(false);
  });

  it("handles undefined device gracefully", () => {
    const { result } = renderHook(() => useFlash(undefined));

    expect(result.current.flashMode).toBe("off");
    expect(result.current.supportsFlash).toBe(false);
    expect(result.current.supportsTorch).toBe(false);
    expect(result.current.torchEnabled).toBe(false);
    expect(result.current.photoFlash).toBe("off");
  });
});
