import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { AspectRatioSelector } from "../aspect-ratio-selector";

describe("AspectRatioSelector", () => {
  const defaultProps = {
    selectedRatio: "16:9" as const,
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders three ratio buttons", () => {
    const { getByLabelText } = render(
      <AspectRatioSelector {...defaultProps} />,
    );

    expect(getByLabelText("Aspect ratio 16:9")).toBeTruthy();
    expect(getByLabelText("Aspect ratio 4:3")).toBeTruthy();
    expect(getByLabelText("Aspect ratio 1:1")).toBeTruthy();
  });

  it("marks selected ratio as active", () => {
    const { getByLabelText } = render(
      <AspectRatioSelector {...defaultProps} selectedRatio="4:3" />,
    );

    const button43 = getByLabelText("Aspect ratio 4:3");
    expect(button43.props.accessibilityState).toEqual({ selected: true });

    const button169 = getByLabelText("Aspect ratio 16:9");
    expect(button169.props.accessibilityState).toEqual({ selected: false });
  });

  it("calls onSelect with correct ratio when pressed", () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(
      <AspectRatioSelector {...defaultProps} onSelect={onSelect} />,
    );

    fireEvent.press(getByLabelText("Aspect ratio 4:3"));
    expect(onSelect).toHaveBeenCalledWith("4:3");

    fireEvent.press(getByLabelText("Aspect ratio 1:1"));
    expect(onSelect).toHaveBeenCalledWith("1:1");
  });

  it("calls onSelect for already selected ratio (no-op handled upstream)", () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(
      <AspectRatioSelector {...defaultProps} onSelect={onSelect} />,
    );

    fireEvent.press(getByLabelText("Aspect ratio 16:9"));
    expect(onSelect).toHaveBeenCalledWith("16:9");
  });
});
