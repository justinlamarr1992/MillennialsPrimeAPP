# Jest Testing Implementation Plan
**Millennials Prime App - Unit Testing Strategy**

**Created:** November 5, 2025
**Framework:** Jest with jest-expo
**Target Coverage:** 70% (Initial: 30%, Final: 70%)
**Timeline:** 1-2 weeks

---

## Executive Summary

This document outlines a comprehensive 6-phase plan to implement unit and integration testing for the Millennials Prime App using Jest. The app currently has 0% test coverage (Critical Issue 1.6). This plan will establish a robust testing infrastructure and incrementally build test coverage across all critical components.

### Current State
- **Test Coverage:** 0%
- **Existing Tests:** 1 snapshot test (ThemedText component)
- **Testing Framework:** Jest + jest-expo (already configured)
- **Missing:** Testing utilities, mocks, test patterns, comprehensive tests

### Goals
- **Days 1-2:** Testing infrastructure setup (Phase 1)
- **Days 3-5:** Utils, hooks, and auth screen tests (Phases 2-4)
- **Days 6-8:** Component and integration tests (Phases 5-6)
- **Days 9-10:** Coverage optimization, documentation, CI/CD integration

---

## Phase 1: Test Infrastructure Setup

**Priority:** CRITICAL
**Estimated Time:** 4-6 hours
**Goal:** Establish complete testing foundation

### 1.1 Install Required Dependencies

```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

**Dependencies Added:**
- `@testing-library/react-native` - React Native specific testing utilities
- `@testing-library/jest-native` - Custom matchers (toBeVisible, toHaveTextContent, etc.)

**Already Installed:**
- `jest` (v29.2.1)
- `jest-expo` (v53.0.9)
- `@types/jest` (v29.5.12)
- `react-test-renderer` (v19.0.0)

### 1.2 Create Jest Configuration File

**File:** `jest.config.js`

```javascript
module.exports = {
  preset: 'jest-expo',

  // Setup files
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/__tests__/setup.ts'
  ],

  // Transform files
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@gorhom/bottom-sheet)'
  ],

  // Module name mapper for @ imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/shared/(.*)$': '<rootDir>/shared/$1',
    '^@/context/(.*)$': '<rootDir>/context/$1',
    '^@/provider/(.*)$': '<rootDir>/provider/$1',
    '^@/firebase/(.*)$': '<rootDir>/firebase/$1',
    '^@/API/(.*)$': '<rootDir>/API/$1',
  },

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.(test|spec).[jt]s?(x)',
    '**/?(*.)+(test|spec).[jt]s?(x)'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    'shared/**/*.{js,jsx,ts,tsx}',
    'context/**/*.{js,jsx,ts,tsx}',
    'provider/**/*.{js,jsx,ts,tsx}',
    '!**/__tests__/**',
    '!**/*.test.{js,jsx,ts,tsx}',
    '!**/*.spec.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/TabsLater/**', // Deprecated code
  ],

  // Coverage thresholds (start low, increase over time)
  coverageThresholds: {
    global: {
      statements: 30,
      branches: 25,
      functions: 30,
      lines: 30,
    },
  },

  // Test environment
  testEnvironment: 'node',

  // Globals
  globals: {
    __DEV__: true,
  },
};
```

### 1.3 Create Test Setup Files

#### 1.3.1 Global Test Setup

**File:** `__tests__/setup.ts`

```typescript
import '@testing-library/jest-native/extend-expect';

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
  BottomSheetModalProvider: ({ children }: any) => children,
}));

// Mock expo-router
jest.mock('expo-router', () => require('./__mocks__/expo-router'));

// Mock Firebase
jest.mock('../firebase/firebaseConfig', () => require('./__mocks__/firebase'));

// Mock React Query
jest.mock('@tanstack/react-query', () => require('./__mocks__/react-query'));
```

#### 1.3.2 Firebase Mocks

**File:** `__tests__/__mocks__/firebase.ts`

```typescript
export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: jest.fn(),
};

export const auth = mockAuth;

export const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  emailVerified: true,
  displayName: 'Test User',
};

// Mock Firebase Auth functions
export const createUserWithEmailAndPassword = jest.fn();
export const signInWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const sendPasswordResetEmail = jest.fn();
export const updateProfile = jest.fn();

// Reset all mocks helper
export const resetFirebaseMocks = () => {
  createUserWithEmailAndPassword.mockReset();
  signInWithEmailAndPassword.mockReset();
  signOut.mockReset();
  sendPasswordResetEmail.mockReset();
  updateProfile.mockReset();
  mockAuth.currentUser = null;
};
```

#### 1.3.3 Expo Router Mocks

**File:** `__tests__/__mocks__/expo-router.ts`

```typescript
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => true),
  setParams: jest.fn(),
};

export const useRouter = jest.fn(() => mockRouter);
export const usePathname = jest.fn(() => '/');
export const useSegments = jest.fn(() => []);
export const useLocalSearchParams = jest.fn(() => ({}));

export const Stack = {
  Screen: 'StackScreen',
};

export const Tabs = {
  Screen: 'TabsScreen',
};

export const Link = 'Link';
export const Redirect = 'Redirect';

// Reset router mocks helper
export const resetRouterMocks = () => {
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
  mockRouter.back.mockClear();
};
```

#### 1.3.4 React Query Mocks

**File:** `__tests__/__mocks__/react-query.ts`

```typescript
export const QueryClient = jest.fn().mockImplementation(() => ({
  clear: jest.fn(),
  cancelQueries: jest.fn(),
  invalidateQueries: jest.fn(),
  refetchQueries: jest.fn(),
  setQueryData: jest.fn(),
  getQueryData: jest.fn(),
}));

export const QueryClientProvider = ({ children }: any) => children;

export const useQuery = jest.fn().mockReturnValue({
  data: undefined,
  error: null,
  isLoading: false,
  isError: false,
  isSuccess: true,
  refetch: jest.fn(),
});

export const useMutation = jest.fn().mockReturnValue({
  mutate: jest.fn(),
  mutateAsync: jest.fn(),
  isLoading: false,
  isError: false,
  isSuccess: false,
  reset: jest.fn(),
});

// Reset query mocks helper
export const resetQueryMocks = () => {
  useQuery.mockClear();
  useMutation.mockClear();
};
```

#### 1.3.5 Custom Test Utilities

**File:** `__tests__/test-utils.tsx`

```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/provider/AuthProvider';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

// All providers wrapper
interface AllProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

const AllProviders: React.FC<AllProvidersProps> = ({ children, queryClient }) => {
  const client = queryClient || createTestQueryClient();

  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient }
) => {
  const { queryClient, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders queryClient={queryClient}>{children}</AllProviders>
    ),
    ...renderOptions,
  });
};

// Re-export everything
export * from '@testing-library/react-native';
export { customRender as render };

// Helper functions
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

export const createMockUser = (overrides = {}) => ({
  uid: 'test-user-123',
  email: 'test@example.com',
  emailVerified: true,
  displayName: 'Test User',
  ...overrides,
});
```

### 1.4 Update package.json Scripts

**File:** `package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:update-snapshots": "jest --updateSnapshot"
  }
}
```

### 1.5 Update .gitignore

Add test-related entries:

```
# Testing
coverage/
.nyc_output/
__tests__/__snapshots__/
*.snap

# Jest
jest-results.json
```

### 1.6 Create Testing Documentation

**File:** `docs/TESTING_GUIDE.md`

```markdown
# Testing Guide

## Running Tests

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests for CI
npm run test:ci

## Writing Tests

### File Naming Convention
- Test files: `ComponentName.test.tsx` or `functionName.test.ts`
- Location: `__tests__/` folder next to the file being tested

### Example Test Structure

...javascript
import { render, screen, fireEvent } from '@/__tests__/test-utils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('should handle user interaction', () => {
    const mockFn = jest.fn();
    render(<MyComponent onPress={mockFn} />);

    fireEvent.press(screen.getByText('Click me'));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
...

## Testing Best Practices

1. **Test user behavior, not implementation**
2. **Use semantic queries** (getByRole, getByLabelText, getByText)
3. **Keep tests simple and focused**
4. **Mock external dependencies**
5. **Use descriptive test names**

## Common Patterns

### Testing Components with Auth
...typescript
import { render } from '@/__tests__/test-utils';
import { mockUser } from '@/__tests__/__mocks__/firebase';

// Component will have access to mocked auth
render(<MyProtectedComponent />);
...

### Testing Navigation
...typescript
import { mockRouter } from '@/__tests__/__mocks__/expo-router';

// Test navigation calls
fireEvent.press(screen.getByText('Go Back'));
expect(mockRouter.back).toHaveBeenCalled();
...
```

---

## Phase 2: Utils & Validation Testing

**Priority:** HIGH
**Estimated Time:** 3-4 hours
**Goal:** Test all utility functions (validation, error handling, logging)

### Files to Test
1. `utils/validation.ts`
2. `utils/errorHandler.ts`
3. `utils/logger.ts`

### 2.1 Validation Tests

**File:** `utils/__tests__/validation.test.ts`

**Test Cases:**
- ✅ `validateEmail` with valid emails
- ✅ `validateEmail` with invalid emails
- ✅ `validateEmail` with empty string
- ✅ `validatePassword` with valid passwords
- ✅ `validatePassword` with weak passwords
- ✅ `validatePassword` missing uppercase/lowercase/numbers/special chars
- ✅ `validatePassword` length requirements
- ✅ `validatePasswordMatch` with matching passwords
- ✅ `validatePasswordMatch` with non-matching passwords
- ✅ `validateRequired` with values and empty strings

**Coverage Target:** 100%

### 2.2 Error Handler Tests

**File:** `utils/__tests__/errorHandler.test.ts`

**Test Cases:**
- ✅ `handleAuthError` with all Firebase error codes
- ✅ `handleAuthError` with unknown error codes
- ✅ User-friendly message format
- ✅ Error logging integration

**Coverage Target:** 100%

### 2.3 Logger Tests

**File:** `utils/__tests__/logger.test.ts`

**Test Cases:**
- ✅ `logger.log` only logs in DEV mode
- ✅ `logger.error` only logs in DEV mode
- ✅ `logger.warn` only logs in DEV mode
- ✅ `logger.exception` always logs (production monitoring)
- ✅ Log format consistency

**Coverage Target:** 100%

---

## Phase 3: Hooks Testing

**Priority:** HIGH
**Estimated Time:** 4-6 hours
**Goal:** Test all custom hooks

### Files to Test
1. `hooks/useAuth.ts`
2. `hooks/useBunnyCDNVideos.ts`
3. `hooks/useRefreshToken.ts`
4. `hooks/useAxiosPrivate.ts`
5. `hooks/useColorScheme.ts`
6. `hooks/useThemeColor.ts`

### 3.1 useAuth Hook Tests

**File:** `hooks/__tests__/useAuth.test.ts`

**Test Cases:**
- ✅ Returns auth context values
- ✅ Throws error when used outside AuthProvider
- ✅ Provides current user
- ✅ Provides loading state
- ✅ Handles auth state changes

**Coverage Target:** 90%

### 3.2 useBunnyCDNVideos Hook Tests

**File:** `hooks/__tests__/useBunnyCDNVideos.test.ts`

**Test Cases:**
- ✅ Fetches video data successfully
- ✅ Returns loading state during fetch
- ✅ Returns error state on fetch failure
- ✅ Uses React Query caching
- ✅ Retry logic on failure

**Coverage Target:** 85%

### 3.3 useRefreshToken Hook Tests

**File:** `hooks/__tests__/useRefreshToken.test.ts`

**Test Cases:**
- ✅ Refreshes Firebase token
- ✅ Updates auth context with new token
- ✅ Handles refresh failure
- ✅ Token caching mechanism

**Coverage Target:** 80%

### 3.4 useAxiosPrivate Hook Tests

**File:** `hooks/__tests__/useAxiosPrivate.test.ts`

**Test Cases:**
- ✅ Adds auth token to requests
- ✅ Refreshes token on 401 error
- ✅ Retries request with new token
- ✅ Handles refresh failure

**Coverage Target:** 75%

### 3.5 Theme Hooks Tests

**File:** `hooks/__tests__/useColorScheme.test.ts`
**File:** `hooks/__tests__/useThemeColor.test.ts`

**Test Cases:**
- ✅ Returns correct color scheme
- ✅ Returns correct theme colors
- ✅ Handles light/dark mode switching

**Coverage Target:** 90%

---

## Phase 4: Auth Screens Testing

**Priority:** CRITICAL
**Estimated Time:** 6-8 hours
**Goal:** Test authentication flow screens

### Files to Test
1. `app/(auth)/RegisterScreen.tsx`
2. `app/(auth)/SignInScreen.tsx`
3. `app/(auth)/PasswordRecoveryScreen.tsx`
4. `app/(tabs)/LogOutScreen.tsx`

### 4.1 RegisterScreen Tests

**File:** `app/(auth)/__tests__/RegisterScreen.test.tsx`

**Test Cases:**
- ✅ Renders all form fields
- ✅ Shows validation errors on blur
- ✅ Disables submit button when form invalid
- ✅ Enables submit button when form valid
- ✅ Calls Firebase createUserWithEmailAndPassword on submit
- ✅ Shows loading state during registration
- ✅ Navigates to SignIn on successful registration
- ✅ Shows error message on registration failure
- ✅ Validates email format in real-time
- ✅ Validates password strength in real-time
- ✅ Validates password match
- ✅ Validates required fields (firstName, lastName)

**Coverage Target:** 80%

### 4.2 SignInScreen Tests

**File:** `app/(auth)/__tests__/SignInScreen.test.tsx`

**Test Cases:**
- ✅ Renders email and password fields
- ✅ Shows validation errors
- ✅ Disables submit when invalid
- ✅ Calls Firebase signInWithEmailAndPassword on submit
- ✅ Shows loading state
- ✅ Navigates to HomePage on success
- ✅ Shows error message on failure
- ✅ Handles invalid credentials error
- ✅ Handles network error
- ✅ "Forgot Password" link navigates correctly

**Coverage Target:** 80%

### 4.3 PasswordRecoveryScreen Tests

**File:** `app/(auth)/__tests__/PasswordRecoveryScreen.test.tsx`

**Test Cases:**
- ✅ Renders email input
- ✅ Validates email format
- ✅ Calls Firebase sendPasswordResetEmail on submit
- ✅ Shows success message
- ✅ Shows error message on failure
- ✅ Disables submit when email invalid
- ✅ Shows loading state

**Coverage Target:** 75%

### 4.4 LogOutScreen Tests

**File:** `app/(tabs)/__tests__/LogOutScreen.test.tsx`

**Test Cases:**
- ✅ Calls Firebase signOut
- ✅ Navigates to SignIn screen after logout
- ✅ Handles logout errors
- ✅ Shows loading state

**Coverage Target:** 70%

---

## Phase 5: Component Testing

**Priority:** HIGH
**Estimated Time:** 8-10 hours
**Goal:** Test shared and post components

### Files to Test
1. `shared/PostComponents/TextPost.tsx`
2. `shared/PostComponents/VideoPost.tsx`
3. `shared/PostComponents/PicturePost.tsx`
4. `shared/PostComponents/UserInfo.tsx`
5. `shared/PostComponents/PrimeNewsPost.tsx`
6. `shared/LikeComment.tsx`
7. `components/ErrorBoundary.tsx`
8. `shared/Timer/DHMSTimer.tsx`
9. `shared/Timer/HMSTimer.tsx`

### 5.1 TextPost Tests

**File:** `shared/PostComponents/__tests__/TextPost.test.tsx`

**Test Cases:**
- ✅ Renders post content correctly
- ✅ Shows author information
- ✅ Shows delete button only for author
- ✅ Calls delete function when clicked
- ✅ Shows prime badge when applicable
- ✅ Shows admin badge when applicable
- ✅ Renders with all required props
- ✅ Handles missing optional props

**Coverage Target:** 75%

### 5.2 VideoPost Tests

**File:** `shared/PostComponents/__tests__/VideoPost.test.tsx`

**Test Cases:**
- ✅ Renders video player
- ✅ Shows video thumbnail
- ✅ Shows author information
- ✅ Shows delete button only for author
- ✅ Handles video play/pause
- ✅ Shows prime badge when applicable
- ✅ Shows admin badge when applicable

**Coverage Target:** 70%

### 5.3 PicturePost Tests

**File:** `shared/PostComponents/__tests__/PicturePost.test.tsx`

**Test Cases:**
- ✅ Renders image correctly
- ✅ Shows image caption
- ✅ Shows author information
- ✅ Shows delete button only for author
- ✅ Handles image loading states
- ✅ Handles image error states

**Coverage Target:** 70%

### 5.4 UserInfo Tests

**File:** `shared/PostComponents/__tests__/UserInfo.test.tsx`

**Test Cases:**
- ✅ Renders user avatar
- ✅ Renders username
- ✅ Renders timestamp
- ✅ Shows prime badge
- ✅ Shows admin badge
- ✅ Handles missing avatar

**Coverage Target:** 80%

### 5.5 LikeComment Tests

**File:** `shared/__tests__/LikeComment.test.tsx`

**Test Cases:**
- ✅ Renders like button
- ✅ Renders comment button
- ✅ Shows like count
- ✅ Shows comment count
- ✅ Calls onLike when like pressed
- ✅ Calls onComment when comment pressed
- ✅ Toggles like state visually

**Coverage Target:** 75%

### 5.6 ErrorBoundary Tests

**File:** `components/__tests__/ErrorBoundary.test.tsx`

**Test Cases:**
- ✅ Renders children when no error
- ✅ Catches errors from children
- ✅ Shows fallback UI on error
- ✅ Shows error details in DEV mode
- ✅ Hides error details in production
- ✅ Retry button resets error state
- ✅ Calls onError callback when error caught
- ✅ Logs errors using logger

**Coverage Target:** 90%

### 5.7 Timer Component Tests

**File:** `shared/Timer/__tests__/DHMSTimer.test.tsx`
**File:** `shared/Timer/__tests__/HMSTimer.test.tsx`

**Test Cases:**
- ✅ Renders countdown correctly
- ✅ Updates countdown over time
- ✅ Formats time correctly
- ✅ Handles countdown completion
- ✅ Shows correct time units (days, hours, minutes, seconds)

**Coverage Target:** 70%

---

## Phase 6: Integration Testing

**Priority:** MEDIUM
**Estimated Time:** 4-6 hours
**Goal:** Test complete user flows

### Test Scenarios

### 6.1 Complete Auth Flow Test

**File:** `__tests__/integration/auth-flow.test.tsx`

**Test Cases:**
- ✅ User registers → signs in → accesses protected route → logs out
- ✅ User enters invalid credentials → sees error
- ✅ User resets password → receives email confirmation
- ✅ Authenticated user navigates between protected screens
- ✅ Unauthenticated user redirected to login

**Coverage Target:** 60%

### 6.2 HomePage Integration Test

**File:** `app/(tabs)/(home)/__tests__/HomePage.integration.test.tsx`

**Test Cases:**
- ✅ Fetches and displays video data
- ✅ Shows loading state while fetching
- ✅ Shows error state on fetch failure
- ✅ Retry button refetches data
- ✅ Posts render correctly
- ✅ User can interact with posts
- ✅ React Query caching works

**Coverage Target:** 60%

### 6.3 Navigation Flow Test

**File:** `__tests__/integration/navigation.test.tsx`

**Test Cases:**
- ✅ Bottom tabs navigation works
- ✅ Nested stack navigation works
- ✅ Protected routes require auth
- ✅ Back button navigation
- ✅ Deep linking (if applicable)

**Coverage Target:** 50%

---

## Testing Metrics & Success Criteria

### Coverage Goals

| Phase | Target Coverage | Timeline |
|-------|----------------|----------|
| Phase 1 | Infrastructure Setup | Day 1-2 (4-6 hours) |
| Phase 2 | Utils: 100% | Day 2-3 (3-4 hours) |
| Phase 3 | Hooks: 80% | Day 3-4 (4-6 hours) |
| Phase 4 | Auth Screens: 75% | Day 4-6 (6-8 hours) |
| Phase 5 | Components: 70% | Day 6-8 (8-10 hours) |
| Phase 6 | Integration: 55% | Day 8-10 (4-6 hours) |
| **TOTAL** | **Overall: 70%** | **10-14 days** |

### Success Criteria

✅ **Days 1-2 Complete:**
- All dependencies installed
- Jest configuration complete
- All mock files created
- Test utilities setup
- Can run `npm test` successfully

✅ **Days 3-5 Complete:**
- 100% utils test coverage
- 80% hooks test coverage
- All auth screens tested
- Test suite runs in < 30 seconds

✅ **Days 6-8 Complete:**
- 70% component test coverage
- Integration tests passing
- Overall coverage > 60%

✅ **Days 9-10 Complete:**
- Overall coverage ≥ 70%
- CI/CD integration complete
- Documentation finalized

---

## Best Practices & Conventions

### File Structure
```
app/
  (auth)/
    __tests__/
      RegisterScreen.test.tsx
      SignInScreen.test.tsx
    RegisterScreen.tsx
    SignInScreen.tsx

hooks/
  __tests__/
    useAuth.test.ts
    useBunnyCDNVideos.test.ts
  useAuth.ts
  useBunnyCDNVideos.ts

__tests__/
  setup.ts
  test-utils.tsx
  __mocks__/
    firebase.ts
    expo-router.ts
    react-query.ts
```

### Naming Conventions
- Test files: `ComponentName.test.tsx` or `functionName.test.ts`
- Test suites: `describe('ComponentName', () => {...})`
- Test cases: `it('should do something specific', () => {...})`
- Integration tests: `feature-name.integration.test.tsx`

### Test Structure (AAA Pattern)
```typescript
it('should handle form submission', async () => {
  // Arrange - Setup
  const mockSubmit = jest.fn();
  render(<MyForm onSubmit={mockSubmit} />);

  // Act - Execute
  fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
  fireEvent.press(screen.getByText('Submit'));

  // Assert - Verify
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
  });
});
```

### What to Test
✅ **DO Test:**
- User interactions (button clicks, form inputs)
- Conditional rendering
- Error states and error handling
- Loading states
- Navigation calls
- API calls (mocked)
- Validation logic
- Business logic

❌ **DON'T Test:**
- Implementation details
- Third-party library internals
- Styles (unless critical to functionality)
- Static content
- TypeScript types

### Mocking Strategy
1. **Mock External Dependencies:** Firebase, APIs, navigation
2. **Mock Heavy Components:** Video players, image pickers
3. **Use Real Code:** Utils, validation, simple components
4. **Partial Mocking:** Only mock what's necessary

---

## CI/CD Integration

### GitHub Actions Workflow

**File:** `.github/workflows/test.yml`

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Comment coverage on PR
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          lcov-file: ./coverage/lcov.info
```

### Pre-commit Hook

**File:** `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run test:ci
```

---

## Troubleshooting

### Common Issues

**Issue:** Tests failing with module import errors
**Solution:** Check `jest.config.js` transformIgnorePatterns and moduleNameMapper

**Issue:** Firebase mock not working
**Solution:** Ensure mock is defined in setup.ts before tests run

**Issue:** Tests timing out
**Solution:** Add `jest.setTimeout(10000)` to setup.ts

**Issue:** Snapshot tests failing
**Solution:** Run `npm run test:update-snapshots` to update

**Issue:** Coverage thresholds not met
**Solution:** Run `npm run test:coverage` to see uncovered lines

### Debug Mode

Run tests in debug mode:
```bash
npm run test:debug
```

Then open `chrome://inspect` in Chrome and click "inspect" on the Node process.

---

## Maintenance Plan

### Weekly
- Review test failures in CI/CD
- Update snapshots as needed
- Monitor coverage reports

### Monthly
- Review and update test coverage thresholds
- Refactor flaky tests
- Update testing documentation

### Quarterly
- Update testing dependencies
- Review testing best practices
- Team testing retrospective

---

## Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [jest-expo Documentation](https://docs.expo.dev/develop/unit-testing/)

### Training Materials
- Internal: `docs/TESTING_GUIDE.md`
- Examples: `__tests__/examples/` (to be created)
- Team workshops: Scheduled after Phase 1 completion

---

## Appendix: Quick Reference

### Run Tests
```bash
npm test                      # Run all tests
npm run test:watch           # Watch mode
npm run test:coverage        # Generate coverage report
npm run test:ci              # CI mode
```

### Common Test Patterns
```typescript
// Basic component test
import { render, screen } from '@/__tests__/test-utils';
render(<MyComponent />);
expect(screen.getByText('Hello')).toBeTruthy();

// User interaction
fireEvent.press(screen.getByText('Click me'));

// Async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeTruthy();
});

// Mock function
const mockFn = jest.fn();
fireEvent.press(screen.getByText('Submit'));
expect(mockFn).toHaveBeenCalled();
```

---

**Document Version:** 1.0
**Last Updated:** November 5, 2025
**Next Review:** After Phase 1 completion
