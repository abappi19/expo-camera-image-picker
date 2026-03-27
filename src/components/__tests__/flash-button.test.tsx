import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { FlashButton } from "../flash-button";

jest.mock("react-native-vision-camera", () => ({}));

describe("FlashButton", () => {
  const defaultProps = {
    flashMode: "off" as const,
    onCycle: jest.fn(),
    supportsFlash: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with correct label for off mode", () => {
    const { getByLabelText } = render(<FlashButton {...defaultProps} />);
    expect(getByLabelText("Flash: off")).toBeTruthy();
  });

  it("renders with correct label for on mode", () => {
    const { getByLabelText } = render(
      <FlashButton {...defaultProps} flashMode="on" />,
    );
    expect(getByLabelText("Flash: on")).toBeTruthy();
  });

  it("renders with correct label for auto mode", () => {
    const { getByLabelText } = render(
      <FlashButton {...defaultProps} flashMode="auto" />,
    );
    expect(getByLabelText("Flash: auto")).toBeTruthy();
  });

  it("renders with correct label for torch mode", () => {
    const { getByLabelText } = render(
      <FlashButton {...defaultProps} flashMode="torch" />,
    );
    expect(getByLabelText("Flash: torch")).toBeTruthy();
  });

  it("calls onCycle when pressed", () => {
    const onCycle = jest.fn();
    const { getByLabelText } = render(
      <FlashButton {...defaultProps} onCycle={onCycle} />,
    );

    fireEvent.press(getByLabelText("Flash: off"));
    expect(onCycle).toHaveBeenCalledTimes(1);
  });

  it("is disabled when supportsFlash is false", () => {
    const onCycle = jest.fn();
    const { getByLabelText } = render(
      <FlashButton {...defaultProps} onCycle={onCycle} supportsFlash={false} />,
    );

    const button = getByLabelText("Flash: off");
    expect(button.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true }),
    );

    fireEvent.press(button);
    expect(onCycle).not.toHaveBeenCalled();
  });
});
