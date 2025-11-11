import React from 'react';
import { render, screen } from '@/__tests__/test-utils';
import BusinessScreen from '../BusinessScreen';

// Mock @react-native-picker/picker
jest.mock('@react-native-picker/picker', () => ({
  Picker: ({ children }: { children: React.ReactNode }) => children,
}));

describe('BusinessScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Content Display', () => {
    it('should display screen title', () => {
      render(<BusinessScreen />);
      expect(screen.getByText('Business Information')).toBeTruthy();
    });

    it('should display subtitle', () => {
      render(<BusinessScreen />);
      expect(screen.getByText('Edit your Business information')).toBeTruthy();
    });

    it('should display business question', () => {
      render(<BusinessScreen />);
      expect(screen.getByText('Do you have a Business')).toBeTruthy();
    });

    it('should display business input placeholder', () => {
      render(<BusinessScreen />);
      expect(screen.getByPlaceholderText('Do you have a Business')).toBeTruthy();
    });

    it('should display save changes button', () => {
      render(<BusinessScreen />);
      expect(screen.getByText('Save Changes')).toBeTruthy();
    });
  });

  describe('Initial State Behavior', () => {
    it('should not show company name question initially', () => {
      render(<BusinessScreen />);
      expect(screen.queryByText('What is the Name of the Company')).toBeNull();
    });

    it('should not show open to business question initially', () => {
      render(<BusinessScreen />);
      expect(screen.queryByText('Are you Open to Business with Users here.')).toBeNull();
    });

    it('should not show industry question initially', () => {
      render(<BusinessScreen />);
      expect(screen.queryByText('What is the Industry you Operate in')).toBeNull();
    });

    it('should not show why industry question initially', () => {
      render(<BusinessScreen />);
      expect(screen.queryByText('Why start a business in the Industry')).toBeNull();
    });

    it('should not show length open question initially', () => {
      render(<BusinessScreen />);
      expect(screen.queryByText('How long have you ran your business?')).toBeNull();
    });

    it('should not show why business question initially', () => {
      render(<BusinessScreen />);
      expect(screen.queryByText('Why did you decide to start your own business')).toBeNull();
    });

    it('should not show first objectives question initially', () => {
      render(<BusinessScreen />);
      expect(screen.queryByText('What were the first objectives for the business?')).toBeNull();
    });

    it('should not show current objectives question initially', () => {
      render(<BusinessScreen />);
      expect(screen.queryByText('What are the objectives now?')).toBeNull();
    });

    it('should not show employee count question initially', () => {
      render(<BusinessScreen />);
      expect(screen.queryByText('How many people work for the business?')).toBeNull();
    });

    it('should not show products and services question initially', () => {
      render(<BusinessScreen />);
      expect(screen.queryByText('What products or services do you offer?')).toBeNull();
    });

    it('should not show primary promotion question initially', () => {
      render(<BusinessScreen />);
      expect(screen.queryByText('What Primary Method Promotes the Business?')).toBeNull();
    });

    it('should not show location factors question initially', () => {
      render(<BusinessScreen />);
      expect(screen.queryByText('What factors influenced the location?')).toBeNull();
    });
  });
});
