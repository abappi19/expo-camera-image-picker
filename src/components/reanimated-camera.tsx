import React from 'react';
import { Camera, type CameraProps } from 'react-native-vision-camera';

export const ReanimatedCamera = React.forwardRef<Camera, CameraProps>((props, ref) => <Camera ref={ref} {...props} />);
ReanimatedCamera.displayName = 'ReanimatedCamera';
