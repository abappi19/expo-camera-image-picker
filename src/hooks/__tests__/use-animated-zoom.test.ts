import { renderHook } from "@testing-library/react-native";

import { useAnimatedZoom } from "../use-animated-zoom";

const mockWithTiming = jest.fn((value: number) => value);
const mockUseSharedValue = jest.fn((initial: number) => ({
  value: initial,
}));
const mockUseAnimatedProps = jest.fn((factory: () => any) => factory());

jest.mock("react-native-reanimated", () => ({
  useSharedValue: (initial: number) => mockUseSharedValue(initial),
  useAnimatedProps: (factory: () => any) => mockUseAnimatedProps(factory),
  withTiming: (value: number, config?: any) => mockWithTiming(value, config),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockUseSharedValue.mockImplementation((initial: number) => ({
    value: initial,
  }));
  mockUseAnimatedProps.mockImplementation((factory: () => any) => factory());
  mockWithTiming.mockImplementation((value: number) => value);
});

describe("useAnimatedZoom", () => {
  it("initializes shared value with target zoom", () => {
    renderHook(() => useAnimatedZoom(2.0));
    expect(mockUseSharedValue).toHaveBeenCalledWith(2.0);
  });

  it("returns animated props with zoom value", () => {
    const { result } = renderHook(() => useAnimatedZoom(1.5));
    expect(result.current).toEqual({ zoom: 1.5 });
  });

  it("calls withTiming when zoom changes", () => {
    const { rerender } = renderHook(({ zoom }) => useAnimatedZoom(zoom), {
      initialProps: { zoom: 1.0 },
    });

    mockWithTiming.mockClear();
    rerender({ zoom: 2.0 });

    expect(mockWithTiming).toHaveBeenCalledWith(2.0, { duration: 300 });
  });

  it("uses useAnimatedProps to create camera props", () => {
    renderHook(() => useAnimatedZoom(1.0));
    expect(mockUseAnimatedProps).toHaveBeenCalledWith(expect.any(Function));
  });
});
