import { Alert } from "react-native";

export function showPermissionErrorAlert(
  message = "Camera permission is required to continue.",
) {
  Alert.alert("Permission required", message);
}
