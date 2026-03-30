import { createAnimatedComponent } from "react-native-reanimated";
import { Camera as RealCamera } from "react-native-vision-camera";

import { isSimulator, Camera as MockCamera } from "./vision-camera";

// createAnimatedComponent requires a class component — the mock is a
// forwardRef function component, so we skip the wrapper on simulator.
export const ReanimatedCamera = isSimulator
  ? (MockCamera as any)
  : createAnimatedComponent(RealCamera);
