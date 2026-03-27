# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A React Native library providing a custom camera modal and image picker built on `react-native-vision-camera`. Exposes a Provider/Hook API (`CameraImagePickerProvider` + `useCameraImagePicker`) for Expo apps. Source-only package — no build step; consumers compile via their own bundler.

## Commands

- `npm run typecheck` — TypeScript static analysis (tsc --noEmit)
- `npm test` — run all Jest tests
- `npx jest --testPathPattern="<pattern>"` — run a single test file

## Architecture

**Provider → Hook → Modal → CameraView** is the core flow:

1. `CameraImagePickerProvider` wraps the app, holds open/close state, result, error, options, and supported features in React Context
2. `useCameraImagePicker()` exposes `openCamera(options?)`, `closeCamera()`, `result`, `isOpen`, `isCapturing`, `error`
3. `CameraImagePickerModal` renders a React Native Modal containing `CameraView`
4. `CameraView` orchestrates Vision Camera, controls, overlays, and filter UI

**Key layers:**

- `src/components/` — UI: `CameraView` (orchestrator), `CameraControls`, `FilterPanel`, `GuideOverlay`, individual buttons/selectors
- `src/hooks/` — state hooks: camera controls, permissions, flash, grid, zoom, aspect ratio, animated zoom
- `src/provider/` — context provider with state and callbacks
- `src/vision-camera/` — Vision Camera integration: adapter (option normalization), capabilities (feature detection), frame processors, pipeline config (filter processing)
- `src/utils/` — permission alerts, performance mode tiers, result mapping (`PhotoFile` → `CameraCaptureResult`)
- `src/types.ts` — all public TypeScript types
- `src/constants.ts` — default values and presets (filters, zoom levels, aspect ratios)

**Filter system:** 7 adjustable parameters (brightness, contrast, saturation, warmth, tint, highlights, shadows) + 5 presets (Natural, Vivid, Warm, Cool, Mono). Applied via frame processor pipeline with strength scaling per performance mode.

**Performance modes** (`quality` / `balanced` / `speed`): control frame processor FPS, filter strength multiplier, and guide overlay availability.

**Public API exports** from `src/index.ts`: `CameraImagePickerProvider`, `CameraImagePickerModal`, `CameraView`, `useCameraImagePicker`, and all public types.

## Peer Dependencies

Consumers must install: `expo`, `react` (>=18), `react-native` (>=0.74), `react-native-reanimated` (>=3), `react-native-safe-area-context` (>=4), `react-native-vision-camera` (>=4).

## Testing

Jest with ts-jest preset, test root is `src/`. Tests live in `__tests__/` directories alongside source. Currently skeleton/placeholder coverage.
