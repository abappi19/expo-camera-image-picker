import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { ZoomSelector } from "../zoom-selector";

jest.mock("react-native-vision-camera", () => ({}));

describe("ZoomSelector", () => {
  const defaultProps = {
    selectedZoom: "1.0x" as const,
    onSelect: jest.fn(),
    supportsUltraWide: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders four zoom buttons", () => {
    const { getByLabelText } = render(<ZoomSelector {...defaultProps} />);

    expect(getByLabelText("Zoom 0.5x")).toBeTruthy();
    expect(getByLabelText("Zoom 1.0x")).toBeTruthy();
    expect(getByLabelText("Zoom 2.0x")).toBeTruthy();
    expect(getByLabelText("Zoom 4.0x")).toBeTruthy();
  });

  it("marks selected zoom as active", () => {
    const { getByLabelText } = render(
      <ZoomSelector {...defaultProps} selectedZoom="2.0x" />,
    );

    const button2x = getByLabelText("Zoom 2.0x");
    expect(button2x.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );

    const button1x = getByLabelText("Zoom 1.0x");
    expect(button1x.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: false }),
    );
  });

  it("calls onSelect with correct zoom level when pressed", () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(
      <ZoomSelector {...defaultProps} onSelect={onSelect} />,
    );

    fireEvent.press(getByLabelText("Zoom 2.0x"));
    expect(onSelect).toHaveBeenCalledWith("2.0x");

    fireEvent.press(getByLabelText("Zoom 4.0x"));
    expect(onSelect).toHaveBeenCalledWith("4.0x");
  });

  it("disables 0.5x button when supportsUltraWide is false", () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(
      <ZoomSelector
        {...defaultProps}
        onSelect={onSelect}
        supportsUltraWide={false}
      />,
    );

    const button05x = getByLabelText("Zoom 0.5x");
    expect(button05x.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true }),
    );

    fireEvent.press(button05x);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("enables 0.5x button when supportsUltraWide is true", () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(
      <ZoomSelector {...defaultProps} onSelect={onSelect} supportsUltraWide />,
    );

    fireEvent.press(getByLabelText("Zoom 0.5x"));
    expect(onSelect).toHaveBeenCalledWith("0.5x");
  });
});
