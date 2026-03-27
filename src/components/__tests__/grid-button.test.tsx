import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GridButton } from '../grid-button';

describe('GridButton', () => {
  it('renders with label Grid: off when grid is off', () => {
    const { getByLabelText } = render(
      <GridButton showGrid={false} onToggle={jest.fn()} />,
    );
    expect(getByLabelText('Grid: off')).toBeTruthy();
  });

  it('renders with label Grid: on when grid is on', () => {
    const { getByLabelText } = render(
      <GridButton showGrid={true} onToggle={jest.fn()} />,
    );
    expect(getByLabelText('Grid: on')).toBeTruthy();
  });

  it('calls onToggle when pressed', () => {
    const onToggle = jest.fn();
    const { getByLabelText } = render(
      <GridButton showGrid={false} onToggle={onToggle} />,
    );

    fireEvent.press(getByLabelText('Grid: off'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('sets accessibilityState selected when grid is on', () => {
    const { getByLabelText } = render(
      <GridButton showGrid={true} onToggle={jest.fn()} />,
    );

    const button = getByLabelText('Grid: on');
    expect(button.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
  });
});
