import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import type { CameraPosition } from "react-native-vision-camera";
import { useCameraDevice } from "react-native-vision-camera";

import { useAspectRatioLayout } from "./aspect-ratio-frame";
import { AspectRatioSelector } from "./aspect-ratio-selector";
import { CameraFlipOverlayView, useCameraFlip } from "./camera-flip-overlay";
import { CameraGridOverlay } from "./camera-grid-overlay";
import { FlashButton } from "./flash-button";
import { GridButton } from "./grid-button";
import {
  CameraIcon,
  CameraSwitchIcon,
  ImageIcon,
  LockIcon,
  XIcon,
} from "./icons";
import {
  RatioTransitionOverlayView,
  useRatioTransition,
} from "./ratio-transition-overlay";
import { ReanimatedCamera } from "./reanimated-camera";
import { ShutterButton } from "./shutter-button";
import { ZoomSelector } from "./zoom-selector";
import { useAnimatedZoom } from "../hooks/use-animated-zoom";
import { useAspectRatio } from "../hooks/use-aspect-ratio";
import { useCameraControls } from "../hooks/use-camera-controls";
import { useCameraPermissions } from "../hooks/use-camera-permissions";
import { useFlash, type FlashMode } from "../hooks/use-flash";
import { useGalleryPicker } from "../hooks/use-gallery-picker";
import { useGrid } from "../hooks/use-grid";
import { useZoom } from "../hooks/use-zoom";
import type { CameraViewProps } from "../types/camera.types";
export function CameraView({
  onCapture,
  onClose,
  onGalleryPress,
  onGallerySelect,
  accentColor = "#FFFFFF",
  style,
}: CameraViewProps) {
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>("back");
  const device = useCameraDevice(cameraPosition);
  const {
    hasPermission,
    requestPermission,
    isLoading: permissionLoading,
  } = useCameraPermissions();
  const { cameraRef, capture, isCapturing } = useCameraControls();
  const { selectedRatio, setSelectedRatio, format } = useAspectRatio(device);
  const { selectedZoom, setSelectedZoom, zoomValue, supportsUltraWide } =
    useZoom(device);
  const animatedZoomProps = useAnimatedZoom(zoomValue);
  const {
    flashMode,
    setFlashMode,
    resetFlash,
    torchEnabled,
    photoFlash,
    supportsFlash,
    supportsTorch,
  } = useFlash(device);
  const { showGrid, toggleGrid } = useGrid();
  const { pickFromGallery } = useGalleryPicker();
  const { frameWidth, frameHeight } = useAspectRatioLayout(selectedRatio);
  const ratioTransition = useRatioTransition();
  const cameraFlip = useCameraFlip();
  const [ratioExpanded, setRatioExpanded] = useState(false);
  const [flashExpanded, setFlashExpanded] = useState(false);

  const handleRatioChange = useCallback(
    (ratio: typeof selectedRatio) => {
      if (ratio !== selectedRatio) {
        ratioTransition.initFrom(selectedRatio);
        ratioTransition.show(ratio);
        setSelectedRatio(ratio);
        setSelectedZoom("1.0x");
        resetFlash();
      }
      setRatioExpanded(false);
    },
    [
      selectedRatio,
      setSelectedRatio,
      setSelectedZoom,
      resetFlash,
      ratioTransition,
    ],
  );

  const toggleRatioExpanded = useCallback(() => {
    setRatioExpanded((prev) => !prev);
  }, []);

  const toggleFlashExpanded = useCallback(() => {
    setFlashExpanded((prev) => !prev);
  }, []);

  const handleFlashSelect = useCallback(
    (mode: FlashMode) => {
      setFlashMode(mode);
      setFlashExpanded(false);
    },
    [setFlashMode],
  );

  const handleCapture = useCallback(async () => {
    const result = await capture(photoFlash);
    if (result) {
      onCapture(result.uri);
    }
  }, [capture, onCapture, photoFlash]);

  const handleGalleryPress = useCallback(async () => {
    if (onGallerySelect) {
      const uris = await pickFromGallery();
      if (uris) {
        onGallerySelect(uris);
        onClose();
      }
    } else if (onGalleryPress) {
      onGalleryPress();
    } else {
      const uris = await pickFromGallery();
      if (uris?.[0]) {
        onCapture(uris[0]);
      }
    }
  }, [onGallerySelect, onGalleryPress, onCapture, pickFromGallery, onClose]);

  const handleCameraSwap = useCallback(() => {
    cameraFlip.trigger();
    setCameraPosition((prev) => (prev === "back" ? "front" : "back"));
  }, [cameraFlip]);

  const showGalleryButton = true;

  const isCameraReady = hasPermission && !permissionLoading && !!device;

  return (
    <SafeAreaView
      style={[styles.container, !isCameraReady && styles.centerContent, style]}
    >
      {permissionLoading ? (
        <Text style={styles.messageText}>Requesting camera access...</Text>
      ) : !hasPermission ? (
        <>
          <View style={styles.iconContainer}>
            <LockIcon size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.messageText}>Camera permission required</Text>
          <Pressable
            onPress={requestPermission}
            style={[styles.permissionButton, { borderColor: accentColor }]}
          >
            <Text style={[styles.permissionButtonText, { color: accentColor }]}>
              Grant Permission
            </Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.closeButtonCenter}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </>
      ) : !device ? (
        <>
          <View style={styles.iconContainer}>
            <CameraIcon size={64} color="#FFFFFF" />
          </View>
          <Text style={styles.messageText}>
            Camera unavailable in simulator
          </Text>
          <Text style={styles.subMessageText}>
            Use Gallery to select photos
          </Text>
          {showGalleryButton && (
            <Pressable
              onPress={handleGalleryPress}
              style={styles.iconButton}
              accessibilityLabel="Open gallery"
            >
              <ImageIcon size={24} color={accentColor} />
            </Pressable>
          )}
          <Pressable onPress={onClose} style={styles.closeButtonCenter}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.cameraWrapper}>
            <View
              style={{
                width: frameWidth,
                height: frameHeight,
                overflow: "hidden",
              }}
            >
              <ReanimatedCamera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                isActive
                photo
                torch={torchEnabled ? "on" : "off"}
                animatedProps={animatedZoomProps}
                resizeMode="contain"
              />
              {showGrid && <CameraGridOverlay />}
            </View>
            <View style={styles.topBar}>
              <View style={styles.topBarContainer}>
                <Pressable
                  onPress={onClose}
                  style={styles.topBarButton}
                  accessibilityLabel="Close camera"
                >
                  <XIcon size={24} color="#FFFFFF" />
                </Pressable>
                <FlashButton
                  flashMode={flashMode}
                  onSelect={handleFlashSelect}
                  expanded={flashExpanded}
                  onToggle={toggleFlashExpanded}
                  supportsFlash={supportsFlash}
                  supportsTorch={supportsTorch}
                  accentColor={accentColor}
                />
                <GridButton
                  showGrid={showGrid}
                  onToggle={toggleGrid}
                  accentColor={accentColor}
                />
              </View>
            </View>

            <View style={styles.zoomBar}>
              {!ratioExpanded && (
                <Animated.View
                  entering={FadeIn.duration(250).withInitialValues({
                    transform: [{ scaleX: 0.3 }],
                  })}
                  exiting={FadeOut.duration(150).withInitialValues({
                    transform: [{ scaleX: 1 }],
                  })}
                >
                  <ZoomSelector
                    selectedZoom={selectedZoom}
                    onSelect={setSelectedZoom}
                    supportsUltraWide={supportsUltraWide}
                    accentColor={accentColor}
                  />
                </Animated.View>
              )}
              <AspectRatioSelector
                selectedRatio={selectedRatio}
                onSelect={handleRatioChange}
                expanded={ratioExpanded}
                onToggle={toggleRatioExpanded}
                accentColor={accentColor}
              />
            </View>

            <View style={styles.bottomBarAbsolute}>
              <View style={styles.bottomControls}>
                <View style={styles.sideButton}>
                  {showGalleryButton && (
                    <Pressable
                      onPress={handleGalleryPress}
                      style={styles.iconButton}
                      accessibilityLabel="Open gallery"
                    >
                      <ImageIcon size={24} color={accentColor} />
                    </Pressable>
                  )}
                </View>
                <ShutterButton
                  onPress={handleCapture}
                  isCapturing={isCapturing}
                  accentColor={accentColor}
                />
                <View style={styles.sideButton}>
                  <Pressable
                    onPress={handleCameraSwap}
                    style={styles.iconButton}
                    accessibilityLabel="Switch camera"
                  >
                    <CameraSwitchIcon size={24} color={accentColor} />
                  </Pressable>
                </View>
              </View>
            </View>

            <RatioTransitionOverlayView
              accentColor={accentColor}
              {...ratioTransition}
            />
            <CameraFlipOverlayView accentColor={accentColor} {...cameraFlip} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  cameraWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 22,
    paddingVertical: 4,
  },
  topBarButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  zoomBar: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    zIndex: 10,
  },
  bottomBarAbsolute: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  sideButton: {
    width: 48,
    alignItems: "center",
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  subMessageText: {
    color: "#AAAAAA",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  closeButtonCenter: {
    paddingVertical: 8,
  },
  closeButtonText: {
    color: "#AAAAAA",
    fontSize: 14,
  },
});
