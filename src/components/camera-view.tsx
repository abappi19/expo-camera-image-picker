import { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { CameraPosition } from "react-native-vision-camera";
import { useCameraDevice } from "react-native-vision-camera";

import { useAspectRatioLayout } from "./aspect-ratio-frame";
import { AspectRatioSelector } from "./aspect-ratio-selector";
import { CameraFlipOverlayView, useCameraFlip } from "./camera-flip-overlay";
import { CameraGridOverlay } from "./camera-grid-overlay";
import { FlashButton } from "./flash-button";
import { FocusIndicator } from "./focus-indicator";
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
import { ToolsButton } from "./tools-button";
import { ZoomSelector } from "./zoom-selector";
import { useAnimatedZoom } from "../hooks/use-animated-zoom";
import { useAspectRatio } from "../hooks/use-aspect-ratio";
import { useCameraControls } from "../hooks/use-camera-controls";
import { useCameraPermissions } from "../hooks/use-camera-permissions";
import { useFilters } from "../hooks/use-filters";
import { useFlash, type FlashMode } from "../hooks/use-flash";
import { useGalleryPicker } from "../hooks/use-gallery-picker";
import { useGrid } from "../hooks/use-grid";
import { useTapToFocus } from "../hooks/use-tap-to-focus";
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
  const {
    selectedZoom,
    zoomValue,
    supportsUltraWide,
    pinchZoomDisplay,
    onPinchStart,
    onPinchUpdate,
    selectPreset,
  } = useZoom(device);
  const animatedZoomProps = useAnimatedZoom(zoomValue);
  const pinchRef = useRef<{ startDistance: number | null; didPinch: boolean }>({
    startDistance: null,
    didPinch: false,
  });
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
  const { filters, presetId, applyPreset, hasActiveFilters } = useFilters();
  const { focusPoint, handleTap } = useTapToFocus(cameraRef);
  const { frameWidth, frameHeight } = useAspectRatioLayout(selectedRatio);
  const ratioTransition = useRatioTransition();
  const cameraFlip = useCameraFlip();
  const insets = useSafeAreaInsets();
  const [ratioExpanded, setRatioExpanded] = useState(false);
  const [flashExpanded, setFlashExpanded] = useState(false);
  const [toolsExpanded, setToolsExpanded] = useState(false);

  const handleRatioChange = useCallback(
    (ratio: typeof selectedRatio) => {
      if (ratio !== selectedRatio) {
        ratioTransition.initFrom(selectedRatio);
        ratioTransition.show(ratio);
        setSelectedRatio(ratio);
        selectPreset("1.0x");
        resetFlash();
      }
      setRatioExpanded(false);
    },
    [
      selectedRatio,
      setSelectedRatio,
      selectPreset,
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

  const toggleToolsExpanded = useCallback(() => {
    setToolsExpanded((prev) => !prev);
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
    <View
      style={[styles.container, !isCameraReady && styles.centerContent, style]}
    >
      {permissionLoading ? (
        <Text style={[styles.messageText, { marginTop: insets.top }]}>
          Requesting camera access...
        </Text>
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
              onTouchStart={(e) => {
                if (e.nativeEvent.touches.length >= 2) {
                  const [t1, t2] = e.nativeEvent.touches;
                  const dx = t1.pageX - t2.pageX;
                  const dy = t1.pageY - t2.pageY;
                  pinchRef.current.startDistance = Math.sqrt(dx * dx + dy * dy);
                  pinchRef.current.didPinch = true;
                  onPinchStart();
                } else if (e.nativeEvent.touches.length === 1) {
                  pinchRef.current.didPinch = false;
                }
              }}
              onTouchMove={(e) => {
                if (
                  e.nativeEvent.touches.length >= 2 &&
                  pinchRef.current.startDistance !== null
                ) {
                  const [t1, t2] = e.nativeEvent.touches;
                  const dx = t1.pageX - t2.pageX;
                  const dy = t1.pageY - t2.pageY;
                  const currentDistance = Math.sqrt(dx * dx + dy * dy);
                  const scale = currentDistance / pinchRef.current.startDistance;
                  onPinchUpdate(scale);
                }
              }}
              onTouchEnd={(e) => {
                if (e.nativeEvent.touches.length < 2) {
                  pinchRef.current.startDistance = null;
                }
                // Single tap → focus (only if no pinch happened during this gesture)
                if (
                  e.nativeEvent.touches.length === 0 &&
                  !pinchRef.current.didPinch
                ) {
                  handleTap(e);
                }
              }}
            >
              <ReanimatedCamera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                isActive
                photo
                exposure={filters.brightness * 2}
                torch={torchEnabled ? "on" : "off"}
                animatedProps={animatedZoomProps}
                resizeMode="cover"
              />
              {showGrid && <CameraGridOverlay />}
              {focusPoint && (
                <FocusIndicator point={focusPoint} accentColor={accentColor} />
              )}
            </View>
            <View style={[styles.topBar, { paddingTop: insets.top }]}>
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

            <View
              style={[
                styles.bottomBarAbsolute,
                { paddingBottom: insets.bottom },
              ]}
            >
              <View style={styles.zoomBar}>
                {!toolsExpanded && !ratioExpanded && (
                  <ToolsButton
                    expanded={false}
                    onToggle={toggleToolsExpanded}
                    presetId={presetId}
                    onPresetSelect={applyPreset}
                    hasActiveFilters={hasActiveFilters}
                    accentColor={accentColor}
                  />
                )}
                {toolsExpanded && (
                  <ToolsButton
                    expanded
                    onToggle={toggleToolsExpanded}
                    presetId={presetId}
                    onPresetSelect={applyPreset}
                    hasActiveFilters={hasActiveFilters}
                    accentColor={accentColor}
                  />
                )}
                {!toolsExpanded && !ratioExpanded && (
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
                      onSelect={selectPreset}
                      supportsUltraWide={supportsUltraWide}
                      accentColor={accentColor}
                      pinchZoomDisplay={pinchZoomDisplay}
                    />
                  </Animated.View>
                )}
                {!toolsExpanded && (
                  <AspectRatioSelector
                    selectedRatio={selectedRatio}
                    onSelect={handleRatioChange}
                    expanded={ratioExpanded}
                    onToggle={toggleRatioExpanded}
                    accentColor={accentColor}
                  />
                )}
              </View>
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
    </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
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
