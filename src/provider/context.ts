import { createContext } from "react";

import type { CameraPickerContextValue } from "../types";

export const CameraImagePickerContext =
  createContext<CameraPickerContextValue | null>(null);
