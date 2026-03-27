import { render } from "@testing-library/react-native";
import React from "react";

import { CameraGridOverlay } from "../camera-grid-overlay";

describe("CameraGridOverlay", () => {
  it("renders the grid container", () => {
    const { getByTestId } = render(<CameraGridOverlay />);
    expect(getByTestId("camera-grid-overlay")).toBeTruthy();
  });

  it("renders 4 grid lines", () => {
    const { getByTestId } = render(<CameraGridOverlay />);
    const container = getByTestId("camera-grid-overlay");
    // 4 children: 2 horizontal + 2 vertical
    expect(container.children.length).toBe(4);
  });

  it("has pointerEvents none (non-interactive overlay)", () => {
    const { getByTestId } = render(<CameraGridOverlay />);
    const container = getByTestId("camera-grid-overlay");
    expect(container.props.pointerEvents).toBe("none");
  });
});
