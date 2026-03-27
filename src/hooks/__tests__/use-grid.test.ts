import { renderHook, act } from "@testing-library/react-native";

import { useGrid } from "../use-grid";

describe("useGrid", () => {
  it("defaults to grid off", () => {
    const { result } = renderHook(() => useGrid());
    expect(result.current.showGrid).toBe(false);
  });

  it("toggles grid on", () => {
    const { result } = renderHook(() => useGrid());

    act(() => result.current.toggleGrid());
    expect(result.current.showGrid).toBe(true);
  });

  it("toggles grid off again", () => {
    const { result } = renderHook(() => useGrid());

    act(() => result.current.toggleGrid());
    act(() => result.current.toggleGrid());
    expect(result.current.showGrid).toBe(false);
  });
});
