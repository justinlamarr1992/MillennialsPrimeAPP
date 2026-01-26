# Testing Standards Guide

**Version**: 1.0
**Last Updated**: January 26, 2026
**Framework**: Jest 29.2.1 with React Testing Library
**Language**: TypeScript

---

## Table of Contents

1. [Overview](#overview)
2. [Test File Organization](#test-file-organization)
3. [Test Naming Conventions](#test-naming-conventions)
4. [Test Structure (AAA Pattern)](#test-structure-aaa-pattern)
5. [Mock Setup Best Practices](#mock-setup-best-practices)
6. [Assertion Guidelines](#assertion-guidelines)
7. [Async Testing](#async-testing)
8. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
9. [Positive Patterns](#positive-patterns)
10. [Coverage Guidelines](#coverage-guidelines)
11. [Template Examples](#template-examples)

---

## Overview

This guide establishes testing standards for the Millennials Prime App React Native/Expo application. All tests should prioritize:

- **Clarity**: Tests should be easy to read and understand
- **Reliability**: Tests should not be flaky or brittle
- **Maintainability**: Tests should be easy to update when code changes
- **Coverage**: Tests should cover critical paths, edge cases, and error scenarios

### Testing Philosophy

- **Test behavior, not implementation**: Focus on what the code does, not how it does it
- **Write tests that give confidence**: Tests should catch real bugs, not just increase coverage numbers
- **Keep tests simple**: Complex tests are hard to maintain and understand
- **Test one thing at a time**: Each test should verify a single behavior

---

## Test File Organization

### Directory Structure

```
project-root/
├── app/
│   ├── (auth)/
│   │   └── __tests__/
│   │       └── SignInScreen.test.tsx
│   └── (tabs)/
│       └── __tests__/
│           └── HomePage.test.tsx
├── hooks/
│   └── __tests__/
│       └── useAuth.test.tsx
├── services/
│   └── __tests__/
│       └── serverAuth.test.ts
├── utils/
│   └── __tests__/
│       └── validation.test.ts
├── components/
│   └── __tests__/
│       └── ErrorBoundary.test.tsx
└── shared/
    └── __tests__/
        └── LikeComment.test.tsx
```

### File Naming

- Test files should be co-located with source files in `__tests__/` directories
- Use `.test.ts` or `.test.tsx` extension
- Match the source file name: `SignInScreen.tsx` → `SignInScreen.test.tsx`

### File Structure

```typescript
/**
 * Tests for [ComponentName/FunctionName]
 * Target Coverage: [Expected Coverage %]
 */

// Imports
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { ComponentUnderTest } from '../ComponentUnderTest';

// Mocks (if needed)
jest.mock('@/path/to/dependency');

describe('ComponentUnderTest', () => {
  // Setup
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test groups by feature
  describe('feature or behavior', () => {
    it('should do something specific', () => {
      // Test implementation
    });
  });
});
```

---

## Test Naming Conventions

### describe() Blocks

Use the component/function name or feature being tested:

**Good:**
```typescript
describe('SignInScreen', () => { ... });
describe('handleAuthError', () => { ... });
describe('email validation', () => { ... });
```

**Bad:**
```typescript
describe('tests', () => { ... });
describe('component tests', () => { ... });
```

### it() / test() Blocks

Use clear, descriptive sentences that explain **what** the test verifies and **why** it matters:

**Good:**
```typescript
it('should display error message when email is invalid', () => { ... });
it('should call onSuccess callback after successful login', () => { ... });
it('should disable submit button while request is pending', () => { ... });
```

**Bad:**
```typescript
it('test email', () => { ... });
it('works', () => { ... });
it('should render correctly', () => { ... });
```

### Naming Patterns

- Start with "should" for behavior: `should display error when...`
- Use "when" or "if" for conditions: `should retry request when network fails`
- Be specific about the expected outcome: `should return null for empty input`
- Avoid vague terms like "correctly", "properly", "successfully" without context

---

## Test Structure (AAA Pattern)

Follow the **Arrange-Act-Assert** pattern for clear, maintainable tests:

```typescript
it('should update profile when form is submitted', async () => {
  // ARRANGE: Set up test data and dependencies
  const mockUpdateProfile = jest.fn().mockResolvedValue({ success: true });
  const mockProfile = { name: 'John Doe', email: 'john@example.com' };

  const { getByTestId } = render(
    <ProfileForm profile={mockProfile} onUpdate={mockUpdateProfile} />
  );

  // ACT: Perform the action being tested
  const nameInput = getByTestId('name-input');
  fireEvent.changeText(nameInput, 'Jane Doe');
  fireEvent.press(getByTestId('submit-button'));

  // ASSERT: Verify the expected outcome
  await waitFor(() => {
    expect(mockUpdateProfile).toHaveBeenCalledWith({
      ...mockProfile,
      name: 'Jane Doe'
    });
  });
});
```

### Guidelines

- **Arrange**: Keep setup minimal and relevant to the test
- **Act**: Test one action at a time
- **Assert**: Verify the specific behavior, not everything
- Use blank lines to separate AAA sections for readability

---

## Mock Setup Best Practices

### 1. Use jest.spyOn() Instead of Direct Assignment

**Good:**
```typescript
import * as serverAuth from '@/services/serverAuth';

it('should fetch user ID', async () => {
  jest.spyOn(serverAuth, 'getUserId').mockResolvedValue('user-123');
  // Test implementation
});
```

**Bad:**
```typescript
const mockedServerAuth = serverAuth as jest.Mocked<typeof serverAuth>;
mockedServerAuth.getUserId = jest.fn().mockResolvedValue('user-123');
```

**Why**: `jest.spyOn()` is more explicit, easier to restore, and caught by ESLint rules.

### 2. Clear Mocks Between Tests

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 3. Avoid Over-Mocking

**Good (Minimal Mocking):**
```typescript
it('should display logout confirmation', () => {
  const mockLogout = jest.fn();
  const { getByText } = render(<LogOutScreen onLogout={mockLogout} />);

  expect(getByText('Are you sure you want to log out?')).toBeTruthy();
});
```

**Bad (Over-Mocking):**
```typescript
it('should display logout confirmation', () => {
  const mockRouter = { push: jest.fn() };
  const mockAuth = { user: { id: '123' } };
  const mockTheme = { colors: { primary: '#000' } };
  const mockNavigation = { navigate: jest.fn() };
  const mockQueryClient = { invalidateQueries: jest.fn() };
  const mockLogout = jest.fn();
  // ... 3 more mocks

  const { getByText } = render(
    <ThemeProvider theme={mockTheme}>
      <RouterContext.Provider value={mockRouter}>
        <LogOutScreen onLogout={mockLogout} />
      </RouterContext.Provider>
    </ThemeProvider>
  );

  expect(getByText('Are you sure you want to log out?')).toBeTruthy();
});
```

**Why**: Over-mocking makes tests brittle and hard to maintain. Only mock what's necessary for the specific test.

### 4. Mock at the Right Level

- Mock external dependencies (axios, Firebase, SecureStore)
- Mock at module boundaries, not internal functions
- Avoid mocking too deep (tight coupling to implementation)

### 5. Use Realistic Mock Data

**Good:**
```typescript
const mockUser = {
  id: 'user-123',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  roles: { User: 2001 }
};
```

**Bad:**
```typescript
const mockUser = { id: '1', email: 'a', name: 'b' };
```

---

## Assertion Guidelines

### 1. Use Specific Assertions

**Good:**
```typescript
expect(screen.getByText('Invalid email or password')).toBeTruthy();
expect(mockLoginFn).toHaveBeenCalledWith('user@example.com', 'password123');
expect(result).toStrictEqual({ success: true, userId: '123' });
```

**Bad:**
```typescript
expect(screen.getAllByText('Invalid email or password').length).toBeGreaterThan(0);
expect(mockLoginFn).toHaveBeenCalled();
expect(result).toEqual(expect.anything());
```

### 2. Prefer .toStrictEqual() Over .toEqual()

**Good:**
```typescript
expect(result).toStrictEqual({ accessToken: 'token-123', _id: 'user-456' });
```

**Bad:**
```typescript
expect(result).toEqual({ accessToken: 'token-123', _id: 'user-456' });
```

**Why**: `.toStrictEqual()` catches:
- Undefined properties that shouldn't exist
- Array vs object mismatches
- Sparse arrays

### 3. Use .toHaveLength() for Arrays

**Good:**
```typescript
expect(getAllByRole('button')).toHaveLength(3);
```

**Bad:**
```typescript
expect(getAllByRole('button').length).toBe(3);
expect(getAllByRole('button').length).toBeGreaterThan(0);
```

### 4. Avoid Weak Assertions

**Bad Patterns:**
```typescript
expect(element).toBeTruthy(); // Too vague
expect(array.length).toBeGreaterThan(0); // Should know exact length
expect(mockFn).toHaveBeenCalled(); // Should verify call arguments
expect(() => doSomething()).not.toThrow(); // Test should verify behavior
```

### 5. Test Error Messages

**Good:**
```typescript
await expect(validateEmail('')).rejects.toThrow('Email is required');
```

**Bad:**
```typescript
await expect(validateEmail('')).rejects.toThrow();
```

---

## Async Testing

### 1. Mark Async Tests Properly

**Good:**
```typescript
it('should fetch user profile', async () => {
  await userProfileService.fetchProfile();
  expect(mockAxios.get).toHaveBeenCalled();
});
```

**Bad:**
```typescript
it('should fetch user profile', () => {
  userProfileService.fetchProfile();
  expect(mockAxios.get).toHaveBeenCalled();
});
```

### 2. Use waitFor() for State Changes

**Good:**
```typescript
fireEvent.press(loginButton);

await waitFor(() => {
  expect(screen.getByText('Welcome back!')).toBeTruthy();
});
```

**Bad:**
```typescript
fireEvent.press(loginButton);
expect(screen.getByText('Welcome back!')).toBeTruthy(); // Will fail - not waiting
```

### 3. Avoid Unnecessary act() Wrappers

**Good:**
```typescript
fireEvent.press(button);

await waitFor(() => {
  expect(mockCallback).toHaveBeenCalled();
});
```

**Bad:**
```typescript
await act(async () => {
  fireEvent.press(button);
});

await waitFor(() => {
  expect(mockCallback).toHaveBeenCalled();
});
```

**Why**: `fireEvent` already wraps actions in `act()`. Only use `act()` for direct state updates.

### 4. Test Loading States

```typescript
it('should show loading spinner while fetching data', async () => {
  const { getByTestId, queryByTestId } = render(<DataComponent />);

  expect(getByTestId('loading-spinner')).toBeTruthy();

  await waitFor(() => {
    expect(queryByTestId('loading-spinner')).toBeNull();
  });
});
```

---

## Anti-Patterns to Avoid

### 1. Tests with No Assertions ⚠️ CRITICAL

**Bad:**
```typescript
it('should handle press on user name without errors', () => {
  const { getByText } = render(<UserInfo name="John Doe" />);
  const nameElement = getByText('John Doe');
  fireEvent.press(nameElement);
  // Should execute without throwing - navigation logic is logged
});
```

**Why**: This test doesn't test anything. It will always pass.

**Fix:**
```typescript
it('should handle press on user name', () => {
  const mockOnPress = jest.fn();
  const { getByText } = render(<UserInfo name="John Doe" onPress={mockOnPress} />);

  fireEvent.press(getByText('John Doe'));

  expect(mockOnPress).toHaveBeenCalledWith('John Doe');
});
```

**ESLint Rule**: `jest/expect-expect` will catch this.

### 2. Unnecessary act() Wrappers ⚠️ CRITICAL

**Bad:**
```typescript
await act(async () => {
  fireEvent.press(mockProfilePicture);
});
```

**Why**: `fireEvent` already wraps in `act()`. Double-wrapping is unnecessary and flagged by ESLint.

**Fix:**
```typescript
fireEvent.press(mockProfilePicture);

await waitFor(() => {
  expect(mockHandleImageSelected).toHaveBeenCalled();
});
```

**ESLint Rule**: `testing-library/no-unnecessary-act` will catch this.

### 3. Over-Granular Tests

**Bad (38 tests for one screen):**
```typescript
it('should display "First Name" label', () => { ... });
it('should display "Last Name" label', () => { ... });
it('should display "Email" label', () => { ... });
it('should display "Date of Birth" label', () => { ... });
// ... 34 more tests just checking text
```

**Why**: Too many tests for simple rendering. Makes maintenance difficult.

**Fix (Combine into logical groups):**
```typescript
it('should display all required form fields', () => {
  const { getByText } = render(<MyInfoScreen />);

  expect(getByText('First Name')).toBeTruthy();
  expect(getByText('Last Name')).toBeTruthy();
  expect(getByText('Email')).toBeTruthy();
  expect(getByText('Date of Birth')).toBeTruthy();
});
```

### 4. Weak Assertions

**Bad:**
```typescript
expect(getAllByText('13').length).toBeGreaterThanOrEqual(2);
expect(mockFn).toHaveBeenCalled(); // Not checking arguments
expect(element).toBeTruthy(); // Too vague
```

**Fix:**
```typescript
expect(getAllByText('13')).toHaveLength(3);
expect(mockFn).toHaveBeenCalledWith('expected-arg');
expect(getByRole('button', { name: 'Submit' })).toBeEnabled();
```

### 5. Manual Mocking

**Bad:**
```typescript
mockedServerAuth.getUserId = jest.fn().mockResolvedValue('user-123');
```

**Fix:**
```typescript
jest.spyOn(serverAuth, 'getUserId').mockResolvedValue('user-123');
```

**ESLint Rule**: `jest/prefer-spy-on` will catch this.

### 6. DRY Violations

**Bad (Repeated 6 times):**
```typescript
it('should throw error when user ID not found - method1', async () => {
  jest.spyOn(serverAuth, 'getUserId').mockResolvedValue(null);
  await expect(service.method1()).rejects.toThrow('User ID not found');
});

it('should throw error when user ID not found - method2', async () => {
  jest.spyOn(serverAuth, 'getUserId').mockResolvedValue(null);
  await expect(service.method2()).rejects.toThrow('User ID not found');
});
// ... 4 more identical tests
```

**Fix (Extract Helper):**
```typescript
const expectUserIdNotFoundError = async (serviceMethod: () => Promise<any>) => {
  jest.spyOn(serverAuth, 'getUserId').mockResolvedValue(null);
  await expect(serviceMethod()).rejects.toThrow('User ID not found');
};

it('should throw error when user ID not found - method1', async () => {
  await expectUserIdNotFoundError(() => service.method1());
});

it('should throw error when user ID not found - method2', async () => {
  await expectUserIdNotFoundError(() => service.method2());
});
```

### 7. Testing Implementation Details

**Bad:**
```typescript
it('should update internal state variable', () => {
  const component = render(<MyComponent />);
  expect(component.instance().state.counter).toBe(0);
});
```

**Fix (Test Behavior):**
```typescript
it('should display initial count of 0', () => {
  const { getByTestId } = render(<MyComponent />);
  expect(getByTestId('counter-display')).toHaveTextContent('0');
});
```

---

## Positive Patterns

### 1. Comprehensive Edge Case Testing ⭐

**Example from validation.test.ts (9.5/10 quality):**

```typescript
describe('email validation', () => {
  it('should accept valid email formats', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    expect(validateEmail('user123@sub.domain.com')).toBe(true);
  });

  it('should reject invalid email formats', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user @example.com')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('   ')).toBe(false);
    expect(validateEmail(null as any)).toBe(false);
    expect(validateEmail(undefined as any)).toBe(false);
  });

  it('should handle very long emails', () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    expect(validateEmail(longEmail)).toBe(false);
  });

  it('should handle special characters', () => {
    expect(validateEmail('user+tag@example.com')).toBe(true);
    expect(validateEmail('user.name@example.com')).toBe(true);
    expect(validateEmail('user<script>@example.com')).toBe(false);
  });
});
```

**Why This is Good:**
- Tests valid inputs
- Tests invalid inputs
- Tests edge cases (empty, null, undefined)
- Tests length limits
- Tests special characters
- Clear, descriptive test names

### 2. Error Path Coverage ⭐

**Example from errorHandler.test.ts (9.5/10 quality):**

```typescript
describe('handleAuthError', () => {
  describe('sign in errors', () => {
    it('should return user-friendly message for user-not-found', () => {
      const error = new FirebaseError('auth/user-not-found', 'User not found');
      expect(handleAuthError(error)).toBe('No account found with this email address');
    });

    it('should return user-friendly message for wrong-password', () => {
      const error = new FirebaseError('auth/wrong-password', 'Wrong password');
      expect(handleAuthError(error)).toBe('Incorrect password. Please try again');
    });

    it('should return user-friendly message for invalid-credential', () => {
      const error = new FirebaseError('auth/invalid-credential', 'Invalid credential');
      expect(handleAuthError(error)).toBe('Invalid email or password');
    });
  });

  describe('network errors', () => {
    it('should return user-friendly message for network-request-failed', () => {
      const error = new FirebaseError('auth/network-request-failed', 'Network failed');
      expect(handleAuthError(error)).toBe('Network error. Please check your internet connection');
    });
  });

  describe('unknown error codes', () => {
    it('should return generic message for unknown error code', () => {
      const error = new FirebaseError('auth/unknown-error-code', 'Some unknown error');
      expect(handleAuthError(error)).toBe('An unexpected error occurred. Please try again');
    });

    it('should log unknown error codes for debugging', () => {
      const error = new FirebaseError('auth/unknown-error-code', 'Some unknown error');
      handleAuthError(error);

      expect(logger.error).toHaveBeenCalledWith(
        'Unhandled Firebase auth error:',
        'auth/unknown-error-code',
        'Some unknown error'
      );
    });
  });
});
```

**Why This is Good:**
- Tests all error types
- Tests unknown error handling
- Tests logging integration
- Organized by error category
- Verifies exact error messages

### 3. Async Operations with Proper Cleanup ⭐

**Example from useRefreshToken.test.ts (9/10 quality):**

```typescript
describe('useRefreshToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should refresh token when access token expires', async () => {
    const mockRefreshToken = jest.fn().mockResolvedValue('new-token-123');
    jest.spyOn(serverAuth, 'refreshToken').mockImplementation(mockRefreshToken);

    const { result } = renderHook(() => useRefreshToken(), {
      wrapper: createWrapper()
    });

    // Simulate token expiration
    jest.advanceTimersByTime(3600000); // 1 hour

    await waitFor(() => {
      expect(mockRefreshToken).toHaveBeenCalled();
      expect(result.current.accessToken).toBe('new-token-123');
    });
  });

  it('should handle refresh token failure gracefully', async () => {
    const mockError = new Error('Refresh token expired');
    jest.spyOn(serverAuth, 'refreshToken').mockRejectedValue(mockError);

    const { result } = renderHook(() => useRefreshToken(), {
      wrapper: createWrapper()
    });

    jest.advanceTimersByTime(3600000);

    await waitFor(() => {
      expect(result.current.error).toBe('Refresh token expired');
      expect(result.current.accessToken).toBeNull();
    });
  });
});
```

**Why This is Good:**
- Proper timer setup and cleanup
- Tests success and error paths
- Uses waitFor() for async state changes
- Clear test structure

### 4. Data Transformation Testing ⭐

**Example from userProfileService.test.ts (8/10 quality):**

```typescript
describe('updateBusiness', () => {
  it('should transform "Yes" to true when updating business info', async () => {
    jest.spyOn(serverAuth, 'getUserId').mockResolvedValue('user-123');
    (axiosPrivate.patch as jest.Mock).mockResolvedValueOnce({ data: {} });

    await userProfileService.updateBusiness({
      entrepreneur: 'Yes',
      businessSize: 'Small',
      businessLocationReason: 'Market access'
    });

    expect(axiosPrivate.patch).toHaveBeenCalledWith(
      '/users/business/user-123',
      {
        values: {
          entrepreneur: true,
          lengthOpen: 'Small',
          factorsOfLocation: 'Market access'
        }
      }
    );
  });

  it('should transform "No" to false when updating business info', async () => {
    jest.spyOn(serverAuth, 'getUserId').mockResolvedValue('user-123');
    (axiosPrivate.patch as jest.Mock).mockResolvedValueOnce({ data: {} });

    await userProfileService.updateBusiness({
      entrepreneur: 'No',
      businessSize: 'Large',
      businessLocationReason: 'Low cost'
    });

    expect(axiosPrivate.patch).toHaveBeenCalledWith(
      '/users/business/user-123',
      {
        values: {
          entrepreneur: false,
          lengthOpen: 'Large',
          factorsOfLocation: 'Low cost'
        }
      }
    );
  });
});
```

**Why This is Good:**
- Tests data transformation (string → boolean)
- Tests field name mapping (client ↔ server format)
- Verifies exact request payloads
- Tests both true and false cases

### 5. Component Ownership Testing ⭐

**Example from TextPost.test.tsx (8/10 quality):**

```typescript
describe('post ownership', () => {
  it('should display edit/delete options when user owns the post', () => {
    const { getByTestId } = render(
      <TextPost
        {...mockPost}
        authorId="user-123"
        currentUserId="user-123"
      />
    );

    expect(getByTestId('post-menu')).toBeTruthy();
  });

  it('should not display edit/delete options when user does not own post', () => {
    const { queryByTestId } = render(
      <TextPost
        {...mockPost}
        authorId="user-123"
        currentUserId="different-user"
      />
    );

    expect(queryByTestId('post-menu')).toBeNull();
  });

  it('should not display edit/delete options when user is not logged in', () => {
    const { queryByTestId } = render(
      <TextPost
        {...mockPost}
        authorId="user-123"
        currentUserId={null}
      />
    );

    expect(queryByTestId('post-menu')).toBeNull();
  });
});
```

**Why This is Good:**
- Tests all user states (owner, non-owner, not logged in)
- Important for security and UX
- Clear, focused tests

### 6. SecureStore Integration Testing ⭐

**Example from serverAuth.test.ts (8.5/10 quality):**

```typescript
describe('loginToServer', () => {
  it('stores access token and user ID on successful login', async () => {
    const mockResponse = {
      data: {
        accessToken: 'mock-access-token-123',
        _id: 'user-mongodb-id-456',
        roles: { User: 2001 }
      }
    };

    (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await serverAuth.loginToServer('test@example.com', 'password123');

    // Verify API call
    expect(axios.post).toHaveBeenCalledWith('/auth', {
      user: 'test@example.com',
      pwd: 'password123'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    // Verify secure storage
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      'server_access_token',
      'mock-access-token-123'
    );
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      'server_user_id',
      'user-mongodb-id-456'
    );

    // Verify return value
    expect(result).toStrictEqual({
      accessToken: 'mock-access-token-123',
      _id: 'user-mongodb-id-456',
      roles: { User: 2001 }
    });
  });
});
```

**Why This is Good:**
- Tests external dependency integration
- Verifies all side effects (API call, storage, return value)
- Clear AAA structure

---

## Coverage Guidelines

### Target Coverage

Based on baseline analysis:
- **Statements**: 60%+ (current: 62.81%)
- **Branches**: 50%+ (current: 51.74%)
- **Functions**: 60%+ (current: 60.56%)
- **Lines**: 60%+ (current: 62.84%)

### Critical Files (100% Target)

These files require 100% coverage:
- Authentication utilities (validation, errorHandler)
- Core services (serverAuth, userProfileService)
- Security-related utilities
- Error boundaries

### Coverage by Category

| Category | Target | Current | Status |
|----------|--------|---------|--------|
| Authentication Screens | 70% | 73.07% | ✅ |
| Hooks | 80% | 85.23% | ✅ |
| Services | 90% | N/A | - |
| Utilities | 95% | 97%+ | ✅ |
| Components | 60% | 62.96% | ✅ |

### What NOT to Test

- Third-party library code
- Generated code (types, mocks)
- Trivial getters/setters
- Pure UI styling (use snapshot tests)
- Framework internals

---

## Template Examples

### Template 1: Utility Function (validation.test.ts)

**Use for**: Pure functions, validation, data transformation

```typescript
describe('validateEmail', () => {
  it('should accept valid email formats', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('should reject invalid email formats', () => {
    expect(validateEmail('invalid')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null as any)).toBe(false);
  });
});
```

### Template 2: Error Handler (errorHandler.test.ts)

**Use for**: Error handling, message formatting

```typescript
describe('handleAuthError', () => {
  it('should return user-friendly message for user-not-found', () => {
    const error = new FirebaseError('auth/user-not-found', 'User not found');
    expect(handleAuthError(error)).toBe('No account found with this email address');
  });

  it('should return generic message for unknown error', () => {
    const error = new FirebaseError('auth/unknown', 'Unknown error');
    expect(handleAuthError(error)).toBe('An unexpected error occurred. Please try again');
  });
});
```

### Template 3: Screen Component (LogOutScreen.test.tsx)

**Use for**: Screen components, navigation, user flows

```typescript
describe('LogOutScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display confirmation message', () => {
    const { getByText } = render(<LogOutScreen />);
    expect(getByText('Are you sure you want to log out?')).toBeTruthy();
  });

  it('should call logout when confirmed', async () => {
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const { getByText } = render(<LogOutScreen onLogout={mockLogout} />);

    fireEvent.press(getByText('Log Out'));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it('should display error message on logout failure', async () => {
    const mockLogout = jest.fn().mockRejectedValue(new Error('Network error'));
    const { getByText } = render(<LogOutScreen onLogout={mockLogout} />);

    fireEvent.press(getByText('Log Out'));

    await waitFor(() => {
      expect(getByText('Failed to log out. Please try again.')).toBeTruthy();
    });
  });
});
```

### Template 4: Custom Hook (useRefreshToken.test.ts)

**Use for**: Custom React hooks, state management

```typescript
describe('useRefreshToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useRefreshToken(), {
      wrapper: createWrapper()
    });

    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should refresh token successfully', async () => {
    jest.spyOn(serverAuth, 'refreshToken').mockResolvedValue('new-token');

    const { result } = renderHook(() => useRefreshToken(), {
      wrapper: createWrapper()
    });

    act(() => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.token).toBe('new-token');
      expect(result.current.isRefreshing).toBe(false);
    });
  });
});
```

### Template 5: Service (serverAuth.test.ts)

**Use for**: API services, data fetching, external integrations

```typescript
describe('serverAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginToServer', () => {
    it('stores credentials on successful login', async () => {
      const mockResponse = {
        data: {
          accessToken: 'token-123',
          _id: 'user-456',
          roles: { User: 2001 }
        }
      };

      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await serverAuth.loginToServer('user@example.com', 'password');

      expect(axios.post).toHaveBeenCalledWith('/auth', {
        user: 'user@example.com',
        pwd: 'password'
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('server_access_token', 'token-123');
      expect(result).toStrictEqual(mockResponse.data);
    });

    it('throws error on failed login', async () => {
      (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Unauthorized'));

      await expect(
        serverAuth.loginToServer('user@example.com', 'wrongpassword')
      ).rejects.toThrow('Unauthorized');
    });
  });
});
```

### Template 6: Component with Props (TextPost.test.tsx)

**Use for**: Reusable components, shared components

```typescript
describe('TextPost', () => {
  const defaultProps = {
    title: 'Test Post',
    description: 'This is a test post',
    authorId: 'user-123',
    authorName: 'John Doe',
    createdAt: '2026-01-26',
    likeCount: 10,
    commentCount: 5
  };

  it('should display post content', () => {
    const { getByText } = render(<TextPost {...defaultProps} />);

    expect(getByText('Test Post')).toBeTruthy();
    expect(getByText('This is a test post')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('should handle empty title gracefully', () => {
    const { getByText } = render(<TextPost {...defaultProps} title="" />);

    expect(getByText('No Title yet')).toBeTruthy();
  });

  it('should handle very long title', () => {
    const longTitle = 'A'.repeat(500);
    const { getByText } = render(<TextPost {...defaultProps} title={longTitle} />);

    expect(getByText(longTitle)).toBeTruthy();
  });

  it('should handle special characters in title', () => {
    const { getByText } = render(
      <TextPost {...defaultProps} title="Title with & special <chars>" />
    );

    expect(getByText('Title with & special <chars>')).toBeTruthy();
  });
});
```

### Template 7: Error Boundary (ErrorBoundary.test.tsx)

**Use for**: Error boundaries, error handling components

```typescript
describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('should render children when no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Child Component</Text>
      </ErrorBoundary>
    );

    expect(getByText('Child Component')).toBeTruthy();
  });

  it('should render error UI when child throws', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('should log error to console', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });
});
```

---

## Quick Reference Checklist

Before submitting a test file, verify:

- [ ] All tests have clear, descriptive names
- [ ] Each test verifies one specific behavior
- [ ] AAA pattern is followed
- [ ] All tests have at least one assertion
- [ ] No unnecessary `act()` wrappers
- [ ] Using `jest.spyOn()` instead of manual mocking
- [ ] Using `.toStrictEqual()` instead of `.toEqual()`
- [ ] Using `.toHaveLength()` for arrays
- [ ] Async tests properly marked with `async/await`
- [ ] Using `waitFor()` for state changes
- [ ] Mocks are cleared in `beforeEach()`
- [ ] No over-mocking (only mock what's necessary)
- [ ] Error paths are tested
- [ ] Edge cases are covered
- [ ] No magic numbers/strings without explanation
- [ ] Tests can run in isolation
- [ ] No commented-out code or console.logs

---

## ESLint Rules for Tests

The project uses `eslint-plugin-jest` and `eslint-plugin-testing-library` with these key rules:

**Critical Rules (Error):**
- `jest/expect-expect` - All tests must have assertions
- `jest/no-focused-tests` - No `.only()` or `.skip()`
- `testing-library/await-async-queries` - Await async queries
- `testing-library/no-unnecessary-act` - No unnecessary act()

**Important Rules (Warning):**
- `jest/prefer-spy-on` - Use jest.spyOn() instead of manual mocks
- `jest/prefer-strict-equal` - Use .toStrictEqual() instead of .toEqual()
- `jest/no-disabled-tests` - No skipped tests in main branch
- `testing-library/no-wait-for-multiple-assertions` - One assertion per waitFor()

See [eslint.config.test.js](eslint.config.test.js) for full configuration.

---

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [ESLint Plugin Jest](https://github.com/jest-community/eslint-plugin-jest)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Feedback and Updates

This guide is a living document. If you find patterns that should be added or have suggestions for improvements, please:

1. Create an issue in the repository
2. Discuss with the team in code review
3. Update this guide with approved changes

**Last Updated**: January 26, 2026
**Next Review**: March 2026
