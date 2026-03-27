import { useContext } from "react";

import { CameraImagePickerContext } from "../provider/CameraImagePickerProvider";
import type { CameraPickerContextValue } from "../types";

export function useCameraImagePicker(): CameraPickerContextValue {
  const context = useContext(CameraImagePickerContext);
  if (!context)
    throw new Error(
      "useCameraImagePicker must be used within CameraImagePickerProvider",
    );
  return context;
}
