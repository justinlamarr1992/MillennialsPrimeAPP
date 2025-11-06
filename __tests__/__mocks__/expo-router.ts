export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => true),
  setParams: jest.fn(),
};

export const useRouter = jest.fn(() => mockRouter);
export const useNavigation = jest.fn(() => mockRouter);
export const usePathname = jest.fn(() => '/');
export const useSegments = jest.fn(() => []);
export const useLocalSearchParams = jest.fn(() => ({}));
export const useGlobalSearchParams = jest.fn(() => ({}));

export const Stack = {
  Screen: 'StackScreen',
};

export const Tabs = {
  Screen: 'TabsScreen',
};

export const Link = 'Link';
export const Redirect = 'Redirect';
export const router = mockRouter;

// Reset router mocks helper
export const resetRouterMocks = () => {
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
  mockRouter.back.mockClear();
  mockRouter.setParams.mockClear();
};
