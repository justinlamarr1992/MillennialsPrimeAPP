import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import AboutScreen from '../AboutScreen';

describe('AboutScreen', () => {
  describe('Content Display', () => {
    it('should display about text', () => {
      render(<AboutScreen />);
      expect(screen.getByText('About')).toBeTruthy();
    });

    it('should render without crashing', () => {
      render(<AboutScreen />);
      expect(screen.getByText('About')).toBeTruthy();
    });
  });
});
