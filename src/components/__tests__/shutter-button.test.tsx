import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ShutterButton } from '../shutter-button';

describe('ShutterButton', () => {
  it('renders without crashing', () => {
    const { getByLabelText } = render(
      <ShutterButton onPress={jest.fn()} />,
    );
    expect(getByLabelText('Take photo')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <ShutterButton onPress={onPress} />,
    );

    fireEvent.press(getByLabelText('Take photo'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <ShutterButton onPress={onPress} disabled />,
    );

    fireEvent.press(getByLabelText('Take photo'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when isCapturing', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <ShutterButton onPress={onPress} isCapturing />,
    );

    fireEvent.press(getByLabelText('Take photo'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows activity indicator when isCapturing', () => {
    const { UNSAFE_queryByType } = render(
      <ShutterButton onPress={jest.fn()} isCapturing />,
    );

    // ActivityIndicator should be rendered
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_queryByType(ActivityIndicator)).toBeTruthy();
  });
});
