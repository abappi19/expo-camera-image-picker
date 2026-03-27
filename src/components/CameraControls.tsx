import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { AspectRatio, FlashMode } from '../types';
import { AspectRatioSelector } from './aspect-ratio-selector';
import { FlashButton } from './flash-button';
import { GridButton } from './grid-button';
import { ShutterButton } from './shutter-button';
import { ZoomSelector } from './zoom-selector';

interface CameraControlsProps {
  flashMode: FlashMode;
  onCycleFlash: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  selectedRatio: AspectRatio;
  onSelectRatio: (ratio: AspectRatio) => void;
  zoom: number;
  onSelectZoom: (zoom: number) => void;
  onCapture: () => void;
  onSwapCamera: () => void;
  onClose: () => void;
  onRetake: () => void;
  onConfirm: () => void;
  hasPreview: boolean;
  isCapturing: boolean;
}

export function CameraControls(props: CameraControlsProps) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Pressable onPress={props.onClose}><Text style={{ color: '#fff' }}>Close</Text></Pressable>
        <FlashButton mode={props.flashMode} onCycle={props.onCycleFlash} />
        <GridButton showGrid={props.showGrid} onToggle={props.onToggleGrid} />
      </View>

      <AspectRatioSelector selected={props.selectedRatio} onSelect={props.onSelectRatio} />
      <ZoomSelector selectedZoom={props.zoom} onSelect={props.onSelectZoom} />

      {props.hasPreview ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <Pressable onPress={props.onRetake}><Text style={{ color: '#fff' }}>Retake</Text></Pressable>
          <Pressable onPress={props.onConfirm}><Text style={{ color: '#fff' }}>Use Photo</Text></Pressable>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable onPress={props.onSwapCamera}><Text style={{ color: '#fff' }}>Flip</Text></Pressable>
          <ShutterButton onPress={props.onCapture} disabled={props.isCapturing} />
          <View style={{ width: 40 }} />
        </View>
      )}
    </View>
  );
}
