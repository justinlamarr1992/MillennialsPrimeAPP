# Testing Guide
**Millennials Prime App - Developer Testing Reference**

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests for CI (no watch, with coverage)
npm run test:ci

# Debug tests
npm run test:debug

# Update snapshots
npm run test:update-snapshots
```

## Writing Tests

### File Naming Convention
- Test files: `ComponentName.test.tsx` or `functionName.test.ts`
- Location: `__tests__/` folder in the same directory as the file being tested

Example structure:
```
utils/
  validation.ts
  __tests__/
    validation.test.ts

components/
  ErrorBoundary.tsx
  __tests__/
    ErrorBoundary.test.tsx
```

### Example Test Structure

```typescript
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
```

## Testing Best Practices

1. **Test user behavior, not implementation**
   - Focus on what the user sees and does
   - Avoid testing internal state or methods

2. **Use semantic queries** (in order of preference)
   - `getByRole` - Accessibility-friendly
   - `getByLabelText` - For form inputs
   - `getByText` - For text content
   - `getByTestId` - Last resort

3. **Keep tests simple and focused**
   - One assertion per test when possible
   - Clear test names that describe behavior

4. **Mock external dependencies**
   - Use the provided mocks in `__tests__/__mocks__/`
   - Mock API calls, navigation, Firebase

5. **Use descriptive test names**
   ```typescript
   // Good
   it('should show error message when email is invalid', () => {});

   // Bad
   it('test email', () => {});
   ```

## Common Testing Patterns

### Testing Components with Auth

```typescript
import { render } from '@/__tests__/test-utils';
import { mockUser } from '@/__tests__/__mocks__/firebase';

// Component will have access to mocked auth
render(<MyProtectedComponent />);
```

### Testing Navigation

```typescript
import { mockRouter, resetRouterMocks } from '@/__tests__/__mocks__/expo-router';

beforeEach(() => {
  resetRouterMocks();
});

it('should navigate to home on button press', () => {
  render(<MyComponent />);
  fireEvent.press(screen.getByText('Go Home'));

  expect(mockRouter.push).toHaveBeenCalledWith('/home');
});
```

### Testing Async Operations

```typescript
import { render, screen, waitFor } from '@/__tests__/test-utils';

it('should load data', async () => {
  render(<MyComponent />);

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeTruthy();
  });
});
```

### Testing Forms

```typescript
import { render, screen, fireEvent } from '@/__tests__/test-utils';

it('should submit form with valid data', () => {
  const mockSubmit = jest.fn();
  render(<MyForm onSubmit={mockSubmit} />);

  // Fill out form
  fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
  fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');

  // Submit
  fireEvent.press(screen.getByText('Submit'));

  expect(mockSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});
```

### Testing Validation

```typescript
import { validateEmail } from '../validation';

describe('validateEmail', () => {
  it('should return null for valid email', () => {
    expect(validateEmail('test@example.com')).toBeNull();
  });

  it('should return error message for invalid email', () => {
    expect(validateEmail('invalid')).toBe('Invalid email format');
  });

  it('should return error message for empty email', () => {
    expect(validateEmail('')).toBe('Email is required');
  });
});
```

### Testing Hooks

```typescript
import { renderHook } from '@testing-library/react-native';
import { useAuth } from '../useAuth';

it('should return auth context', () => {
  const { result } = renderHook(() => useAuth());

  expect(result.current.user).toBeDefined();
  expect(result.current.loading).toBe(false);
});
```

## Available Mocks

### Firebase Auth
```typescript
import {
  mockAuth,
  mockUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  resetFirebaseMocks,
} from '@/__tests__/__mocks__/firebase';
```

### Expo Router
```typescript
import {
  mockRouter,
  useRouter,
  resetRouterMocks,
} from '@/__tests__/__mocks__/expo-router';
```

### React Query
```typescript
import {
  useQuery,
  useMutation,
  resetQueryMocks,
} from '@/__tests__/__mocks__/react-query';
```

## Troubleshooting

### Test fails with "Cannot find module"
- Check that `jest.config.js` has correct `moduleNameMapper`
- Ensure the mock file exists in `__tests__/__mocks__/`

### Test times out
- Add `jest.setTimeout(10000)` in setup.ts
- Check for unresolved promises in async tests

### Mock not working
- Ensure mock is defined before test runs
- Check that mock path matches actual import path
- Clear mocks between tests using `beforeEach`

### Snapshot test failing
- Run `npm run test:update-snapshots` to update
- Review changes carefully before committing

## Test Coverage

View coverage report:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

Current coverage thresholds (in `jest.config.js`):
- Statements: 30%
- Branches: 25%
- Functions: 30%
- Lines: 30%

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [jest-expo Documentation](https://docs.expo.dev/develop/unit-testing/)

## Questions?

Refer to the [TESTING_IMPLEMENTATION_PLAN.md](./TESTING_IMPLEMENTATION_PLAN.md) for the complete testing strategy and roadmap.
