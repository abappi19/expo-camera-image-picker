import { renderHook, act } from '@testing-library/react-native';
import { useZoom } from '../use-zoom';

jest.mock('react-native-vision-camera', () => ({}));

const mockDevice = {
  id: 'back-camera',
  minZoom: 0.5,
  maxZoom: 16,
  neutralZoom: 1,
} as any;

describe('useZoom', () => {
  it('defaults to 1.0x zoom', () => {
    const { result } = renderHook(() => useZoom(mockDevice));

    expect(result.current.selectedZoom).toBe('1.0x');
    expect(result.current.zoomValue).toBe(1);
  });

  it('maps 0.5x to device.minZoom', () => {
    const { result } = renderHook(() => useZoom(mockDevice));

    act(() => {
      result.current.setSelectedZoom('0.5x');
    });

    expect(result.current.zoomValue).toBe(0.5);
  });

  it('maps 1.0x to device.neutralZoom', () => {
    const { result } = renderHook(() => useZoom(mockDevice));

    expect(result.current.zoomValue).toBe(1);
  });

  it('maps 2.0x to neutralZoom * 2', () => {
    const { result } = renderHook(() => useZoom(mockDevice));

    act(() => {
      result.current.setSelectedZoom('2.0x');
    });

    expect(result.current.zoomValue).toBe(2);
  });

  it('maps 4.0x to neutralZoom * 4', () => {
    const { result } = renderHook(() => useZoom(mockDevice));

    act(() => {
      result.current.setSelectedZoom('4.0x');
    });

    expect(result.current.zoomValue).toBe(4);
  });

  it('clamps zoom to device.maxZoom', () => {
    const limitedDevice = { ...mockDevice, maxZoom: 3 } as any;
    const { result } = renderHook(() => useZoom(limitedDevice));

    act(() => {
      result.current.setSelectedZoom('4.0x');
    });

    expect(result.current.zoomValue).toBe(3);
  });

  it('detects ultra-wide support when minZoom < neutralZoom', () => {
    const { result } = renderHook(() => useZoom(mockDevice));
    expect(result.current.supportsUltraWide).toBe(true);
  });

  it('detects no ultra-wide when minZoom === neutralZoom', () => {
    const noUltraWide = { ...mockDevice, minZoom: 1 } as any;
    const { result } = renderHook(() => useZoom(noUltraWide));
    expect(result.current.supportsUltraWide).toBe(false);
  });

  it('handles undefined device gracefully', () => {
    const { result } = renderHook(() => useZoom(undefined));

    expect(result.current.selectedZoom).toBe('1.0x');
    expect(result.current.zoomValue).toBe(1);
    expect(result.current.supportsUltraWide).toBe(false);
  });

  it('updates selectedZoom when setSelectedZoom is called', () => {
    const { result } = renderHook(() => useZoom(mockDevice));

    act(() => {
      result.current.setSelectedZoom('2.0x');
    });

    expect(result.current.selectedZoom).toBe('2.0x');
  });
});
