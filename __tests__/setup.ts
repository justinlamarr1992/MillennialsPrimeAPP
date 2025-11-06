// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock Expo modules
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      firebaseApiKey: 'test-api-key',
      firebaseAuthDomain: 'test.firebaseapp.com',
      firebaseProjectId: 'test-project',
    },
  },
}));

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => ({
  __esModule: true,
  default: 'BottomSheet',
  BottomSheetModal: 'BottomSheetModal',
  BottomSheetModalProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  mockRouter: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    setParams: jest.fn(),
  },
  useNavigation: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    setParams: jest.fn(),
  })),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    setParams: jest.fn(),
  },
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
    setParams: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSegments: jest.fn(() => []),
  useLocalSearchParams: jest.fn(() => ({})),
  Stack: {
    Screen: 'StackScreen',
  },
  Tabs: {
    Screen: 'TabsScreen',
  },
  Link: 'Link',
  Redirect: 'Redirect',
}));

// Mock Firebase
jest.mock('../firebase/firebaseConfig', () => require('./__mocks__/firebase'));

// Mock React Query
jest.mock('@tanstack/react-query', () => require('./__mocks__/react-query'));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
    Videos: 'Videos',
    All: 'All',
  },
}));

// Mock React Native useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: jest.fn(() => 'light'),
}));
