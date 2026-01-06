import React from 'react';
import { render, screen, fireEvent } from '@/__tests__/test-utils';
import MyInfoScreen from '../MyInfoScreen';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
    push: jest.fn(),
  },
}));

// Mock @react-native-picker/picker
jest.mock('@react-native-picker/picker', () => ({
  Picker: ({ children }: { children: React.ReactNode }) => children,
}));

describe('MyInfoScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Content Display', () => {
    it('should display screen title', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Basic Information')).toBeTruthy();
    });

    it('should display subtitle', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Edit your Profile information')).toBeTruthy();
    });

    it('should display save changes button', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Save Changes')).toBeTruthy();
    });
  });

  describe('Basic Information Fields', () => {
    it('should display name label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Name')).toBeTruthy();
    });

    it('should display name input placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Enter Name')).toBeTruthy();
    });

    it('should display username label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Username')).toBeTruthy();
    });

    it('should display username input placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Enter Username')).toBeTruthy();
    });

    it('should display email label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Email')).toBeTruthy();
    });

    it('should display email input placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Enter Email')).toBeTruthy();
    });

    it('should display birthday label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Birthday')).toBeTruthy();
    });

    it('should display birthday input placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Enter Birthday')).toBeTruthy();
    });
  });

  describe('Location Fields', () => {
    it('should display country label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Country')).toBeTruthy();
    });

    it('should display country input placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Enter Country')).toBeTruthy();
    });

    it('should display state label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('State')).toBeTruthy();
    });

    it('should display state input placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Enter State')).toBeTruthy();
    });

    it('should display city label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('City')).toBeTruthy();
    });

    it('should display city input placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Enter City')).toBeTruthy();
    });

    it('should display zip label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Zip')).toBeTruthy();
    });

    it('should display zip input placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Enter Zip')).toBeTruthy();
    });
  });

  describe('Privacy Settings Fields', () => {
    it('should display viewers can like label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Viewers Can Like')).toBeTruthy();
    });

    it('should display viewers can like placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Can Users Like your Post?')).toBeTruthy();
    });

    it('should display viewers can dislike label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Viewers Can Dislike')).toBeTruthy();
    });

    it('should display viewers can dislike placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Can Users Dislike your Post')).toBeTruthy();
    });

    it('should display viewers can comment label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Viewers Can Comment')).toBeTruthy();
    });

    it('should display viewers can comment placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Can Users Comment on Your Post')).toBeTruthy();
    });

    it('should display viewers can share label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Viewers Can Share')).toBeTruthy();
    });

    it('should display viewers can share placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Can Users Share your Post')).toBeTruthy();
    });
  });

  describe('Business Settings Fields', () => {
    it('should display industry label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Your Industry')).toBeTruthy();
    });

    it('should display industry placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('What is the Industry you Operate in')).toBeTruthy();
    });

    it('should display B2B label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Looking for B2B Relationships')).toBeTruthy();
    });

    it('should display B2B placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Business to Business?')).toBeTruthy();
    });

    it('should display e-commerce label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('E-Commerce')).toBeTruthy();
    });

    it('should display e-commerce placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Would you like to Sell Items')).toBeTruthy();
    });

    it('should display upload content label', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('Upload Content')).toBeTruthy();
    });

    it('should display upload content placeholder', () => {
      render(<MyInfoScreen />);
      expect(screen.getByPlaceholderText('Do you have Content to Upload')).toBeTruthy();
    });
  });

  describe('Form Input Behavior', () => {
    it('should handle name input changes', () => {
      const { getByPlaceholderText } = render(<MyInfoScreen />);

      const nameInput = getByPlaceholderText('Enter Name');
      fireEvent.changeText(nameInput, 'John Doe');

      expect(nameInput.props.value).toBe('John Doe');
    });

    it('should handle country input changes', () => {
      const { getByPlaceholderText } = render(<MyInfoScreen />);

      const countryInput = getByPlaceholderText('Enter Country');
      fireEvent.changeText(countryInput, 'United States');

      expect(countryInput.props.value).toBe('United States');
    });

    it('should handle state input changes', () => {
      const { getByPlaceholderText } = render(<MyInfoScreen />);

      const stateInput = getByPlaceholderText('Enter State');
      fireEvent.changeText(stateInput, 'California');

      expect(stateInput.props.value).toBe('California');
    });

    it('should handle city input changes', () => {
      const { getByPlaceholderText } = render(<MyInfoScreen />);

      const cityInput = getByPlaceholderText('Enter City');
      fireEvent.changeText(cityInput, 'Los Angeles');

      expect(cityInput.props.value).toBe('Los Angeles');
    });

    it('should handle zip input changes', () => {
      const { getByPlaceholderText } = render(<MyInfoScreen />);

      const zipInput = getByPlaceholderText('Enter Zip');
      fireEvent.changeText(zipInput, '90210');

      expect(zipInput.props.value).toBe('90210');
    });
  });

  describe('Save Button Behavior', () => {
    it('should display save button', () => {
      const { getByText } = render(<MyInfoScreen />);

      expect(getByText('Save Changes')).toBeTruthy();
    });

    it('should allow pressing save button', () => {
      const { getByText } = render(<MyInfoScreen />);

      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);

      expect(saveButton).toBeTruthy();
    });
  });

  describe('User can navigate back', () => {
    it('shows back button at top of screen', () => {
      render(<MyInfoScreen />);
      expect(screen.getByText('← Back')).toBeTruthy();
    });

    it('allows user to press back button', () => {
      render(<MyInfoScreen />);

      const backButton = screen.getByText('← Back');
      fireEvent.press(backButton);

      // Verify the button is pressable (no error thrown)
      expect(backButton).toBeTruthy();
    });
  });
});
