import React from 'react';
import { render, screen, fireEvent } from '@/__tests__/test-utils';
import ProfileHeader from '../ProfileHeader';
import { ServerUserProfile } from '@/types/UserProfile';

describe('ProfileHeader - User Behavior', () => {
  const mockUser: ServerUserProfile = {
    _id: 'test-user-id',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    email: 'john@example.com',
    profilePic: 'https://example.com/pic.jpg',
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA',
    },
  };

  const mockOnEditPress = jest.fn();
  const mockOnConnectPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Given a user views their own profile', () => {
    it('should display their full name', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('John Doe')).toBeTruthy();
    });

    it('should display their username handle', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('@johndoe')).toBeTruthy();
    });

    it('should display their location', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('New York, NY, USA')).toBeTruthy();
    });

    it('should show post count', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('Posts')).toBeTruthy();
    });

    it('should show friends count', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('Friends')).toBeTruthy();
    });

    it('should show "Edit Profile" button', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('Edit Profile')).toBeTruthy();
    });

    it('should not show "Connect" button', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.queryByText('Connect')).toBeNull();
    });
  });

  describe('When a user presses the Edit Profile button', () => {
    it('should trigger the edit action', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      fireEvent.press(screen.getByText('Edit Profile'));

      expect(mockOnEditPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Given a user views another user profile', () => {
    it('should display the other user name', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={false}
          onConnectPress={mockOnConnectPress}
        />
      );

      expect(screen.getByText('John Doe')).toBeTruthy();
    });

    it('should show "Connect" button when not connected', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={false}
          onConnectPress={mockOnConnectPress}
          connectionStatus="none"
        />
      );

      expect(screen.getByText('Connect')).toBeTruthy();
    });

    it('should show "Pending" when connection request is pending', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={false}
          onConnectPress={mockOnConnectPress}
          connectionStatus="pending"
        />
      );

      expect(screen.getByText('Pending')).toBeTruthy();
    });

    it('should show "Connected" when users are connected', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={false}
          onConnectPress={mockOnConnectPress}
          connectionStatus="connected"
        />
      );

      expect(screen.getByText('Connected')).toBeTruthy();
    });

    it('should not show "Edit Profile" button', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={false}
          onConnectPress={mockOnConnectPress}
        />
      );

      expect(screen.queryByText('Edit Profile')).toBeNull();
    });
  });

  describe('When a user presses the Connect button', () => {
    it('should trigger the connect action', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={false}
          onConnectPress={mockOnConnectPress}
          connectionStatus="none"
        />
      );

      fireEvent.press(screen.getByText('Connect'));

      expect(mockOnConnectPress).toHaveBeenCalledTimes(1);
    });

    it('should not trigger action when status is pending', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={false}
          onConnectPress={mockOnConnectPress}
          connectionStatus="pending"
        />
      );

      fireEvent.press(screen.getByText('Pending'));

      expect(mockOnConnectPress).not.toHaveBeenCalled();
    });
  });

  describe('Given different user data formats', () => {
    it('should show username when full name is not available', () => {
      const userWithUsernameOnly = {
        ...mockUser,
        name: '',
      } as ServerUserProfile;

      render(
        <ProfileHeader
          user={userWithUsernameOnly}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('johndoe')).toBeTruthy();
    });

    it('should show firstName and lastName when name field is empty', () => {
      const userWithSplitName = {
        ...mockUser,
        name: '',
        username: '',
      } as ServerUserProfile;

      render(
        <ProfileHeader
          user={userWithSplitName}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('John Doe')).toBeTruthy();
    });

    it('should show "User" when no name information is available', () => {
      const userWithNoName = {
        ...mockUser,
        name: '',
        username: '',
        firstName: '',
        lastName: '',
      } as ServerUserProfile;

      render(
        <ProfileHeader
          user={userWithNoName}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('User')).toBeTruthy();
    });

    it('should not show username handle when username is empty', () => {
      const userWithoutUsername = {
        ...mockUser,
        username: '',
      } as ServerUserProfile;

      render(
        <ProfileHeader
          user={userWithoutUsername}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.queryByText(/@/)).toBeNull();
    });

    it('should show partial location when some fields are missing', () => {
      const userWithPartialLocation = {
        ...mockUser,
        location: {
          city: 'Los Angeles',
          state: 'CA',
        },
      } as ServerUserProfile;

      render(
        <ProfileHeader
          user={userWithPartialLocation}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('Los Angeles, CA')).toBeTruthy();
    });

    it('should show country only when other location fields are missing', () => {
      const userWithCountryOnly = {
        ...mockUser,
        location: {
          country: 'Canada',
        },
      } as ServerUserProfile;

      render(
        <ProfileHeader
          user={userWithCountryOnly}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('Canada')).toBeTruthy();
    });

    it('should show "Location not set" when location is missing', () => {
      const userWithoutLocation = {
        ...mockUser,
        location: undefined,
      } as ServerUserProfile;

      render(
        <ProfileHeader
          user={userWithoutLocation}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('Location not set')).toBeTruthy();
    });

    it('should show "Location not set" when location fields are empty', () => {
      const userWithEmptyLocation = {
        ...mockUser,
        location: {
          city: '',
          state: '',
          country: '',
        },
      } as ServerUserProfile;

      render(
        <ProfileHeader
          user={userWithEmptyLocation}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('Location not set')).toBeTruthy();
    });
  });

  describe('Given special characters and unicode', () => {
    it('should display names with special characters correctly', () => {
      const userWithSpecialChars = {
        ...mockUser,
        name: "O'Brien-Smith Jr.",
      } as ServerUserProfile;

      render(
        <ProfileHeader
          user={userWithSpecialChars}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText("O'Brien-Smith Jr.")).toBeTruthy();
    });

    it('should display locations with unicode characters correctly', () => {
      const userWithUnicode = {
        ...mockUser,
        location: {
          city: 'São Paulo',
          country: 'Brasil',
        },
      } as ServerUserProfile;

      render(
        <ProfileHeader
          user={userWithUnicode}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByText('São Paulo, Brasil')).toBeTruthy();
    });
  });

  describe('Component stability', () => {
    it('should render without crashing', () => {
      expect(() =>
        render(
          <ProfileHeader
            user={mockUser}
            isOwnProfile={true}
          />
        )
      ).not.toThrow();
    });

    it('should be accessible via testID', () => {
      render(
        <ProfileHeader
          user={mockUser}
          isOwnProfile={true}
          onEditPress={mockOnEditPress}
        />
      );

      expect(screen.getByTestId('profile-header')).toBeTruthy();
      expect(screen.getByTestId('user-name')).toBeTruthy();
      expect(screen.getByTestId('user-location')).toBeTruthy();
    });
  });
});
