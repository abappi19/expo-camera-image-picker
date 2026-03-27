import { renderHook, act } from '@testing-library/react-native';
import { useGalleryPicker } from '../use-gallery-picker';

const mockRequestMediaLibraryPermissionsAsync = jest.fn();
const mockLaunchImageLibraryAsync = jest.fn();

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: (...args: any[]) =>
    mockRequestMediaLibraryPermissionsAsync(...args),
  launchImageLibraryAsync: (...args: any[]) =>
    mockLaunchImageLibraryAsync(...args),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({
    status: 'granted',
  });
});

describe('useGalleryPicker', () => {
  it('returns pickFromGallery function', () => {
    const { result } = renderHook(() => useGalleryPicker());
    expect(typeof result.current.pickFromGallery).toBe('function');
  });

  it('requests media library permission', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: true,
      assets: null,
    });

    const { result } = renderHook(() => useGalleryPicker());

    await act(async () => {
      await result.current.pickFromGallery();
    });

    expect(mockRequestMediaLibraryPermissionsAsync).toHaveBeenCalledTimes(1);
  });

  it('returns null when permission denied', async () => {
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({
      status: 'denied',
    });

    const { result } = renderHook(() => useGalleryPicker());

    let uris: string[] | null = null;
    await act(async () => {
      uris = await result.current.pickFromGallery();
    });

    expect(uris).toBeNull();
    expect(mockLaunchImageLibraryAsync).not.toHaveBeenCalled();
  });

  it('launches image library with multi-select', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [
        { uri: 'file://photo1.jpg', width: 100, height: 100 },
        { uri: 'file://photo2.jpg', width: 200, height: 200 },
      ],
    });

    const { result } = renderHook(() => useGalleryPicker());

    await act(async () => {
      await result.current.pickFromGallery();
    });

    expect(mockLaunchImageLibraryAsync).toHaveBeenCalledWith({
      allowsMultipleSelection: true,
      mediaTypes: ['images'],
    });
  });

  it('returns URIs from selected assets', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [
        { uri: 'file://photo1.jpg', width: 100, height: 100 },
        { uri: 'file://photo2.jpg', width: 200, height: 200 },
      ],
    });

    const { result } = renderHook(() => useGalleryPicker());

    let uris: string[] | null = null;
    await act(async () => {
      uris = await result.current.pickFromGallery();
    });

    expect(uris).toEqual(['file://photo1.jpg', 'file://photo2.jpg']);
  });

  it('returns null when user cancels picker', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: true,
      assets: null,
    });

    const { result } = renderHook(() => useGalleryPicker());

    let uris: string[] | null = null;
    await act(async () => {
      uris = await result.current.pickFromGallery();
    });

    expect(uris).toBeNull();
  });

  it('returns null when assets is null', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: null,
    });

    const { result } = renderHook(() => useGalleryPicker());

    let uris: string[] | null = null;
    await act(async () => {
      uris = await result.current.pickFromGallery();
    });

    expect(uris).toBeNull();
  });

  it('returns null when assets is empty array', async () => {
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [],
    });

    const { result } = renderHook(() => useGalleryPicker());

    let uris: string[] | null = null;
    await act(async () => {
      uris = await result.current.pickFromGallery();
    });

    expect(uris).toBeNull();
  });
});
