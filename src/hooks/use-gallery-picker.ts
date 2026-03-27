import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

export interface GalleryPickerState {
  pickFromGallery: () => Promise<string[] | null>;
}

export function useGalleryPicker(): GalleryPickerState {
  const pickFromGallery = useCallback(async (): Promise<string[] | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ['images'],
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    return result.assets.map((asset) => asset.uri);
  }, []);

  return { pickFromGallery };
}
