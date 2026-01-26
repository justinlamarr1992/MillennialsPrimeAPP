# Test Utilities

This directory contains reusable test utilities to improve test quality and reduce duplication.

## Directory Structure

```
__tests__/
├── factories/          # Mock data generators
│   └── mockDataFactory.ts
├── matchers/           # Custom Jest matchers
│   └── customMatchers.ts
└── scenarios/          # Reusable test scenarios
    └── commonScenarios.ts
```

## Factories

Mock data generators for creating consistent test data.

### Usage

```typescript
import {
  createMockUser,
  createMockTextPost,
  createMockAuthResponse,
} from '@/__tests__/factories/mockDataFactory';

// Create with defaults
const user = createMockUser();
// { id: 'user-123', email: 'test@example.com', ... }

// Override specific fields
const admin = createMockUser({
  email: 'admin@example.com',
  roles: { User: 2001, Admin: 5150 },
});

// Use specialized factories
const primeUser = createMockPrimeUser();
const adminPost = createMockAdminPost({ title: 'Admin Announcement' });

// Create multiple instances
const users = createMockUsers(5);
const posts = createMockPosts(10);
```

### Available Factories

**User Data:**
- `createMockUser(overrides)` - Basic user
- `createMockAdminUser(overrides)` - Admin user
- `createMockPrimeUser(overrides)` - Prime user
- `createMockAuthResponse(overrides)` - Auth response

**Profile Data:**
- `createMockMyInfoProfile(overrides)` - Personal info
- `createMockBusinessProfile(overrides)` - Business info
- `createMockArtProfile(overrides)` - Artist info

**Post Data:**
- `createMockTextPost(overrides)` - Text post
- `createMockVideoPost(overrides)` - Video post
- `createMockPicturePost(overrides)` - Picture post
- `createMockComment(overrides)` - Comment

**Error Data:**
- `createMockFirebaseError(code, message)` - Firebase error
- `createMockAuthErrors()` - All auth errors

**Form Data:**
- `createMockLoginForm(overrides)` - Login form
- `createMockRegisterForm(overrides)` - Register form

**Edge Cases:**
- `edgeCaseStrings` - Common string edge cases
- `edgeCaseNumbers` - Common number edge cases
- `edgeCaseArrays` - Common array edge cases

## Custom Matchers

Domain-specific assertions that make tests more readable.

### Usage

Custom matchers are automatically registered in `setup.ts`. Just use them:

```typescript
// Email validation
expect('user@example.com').toBeValidEmail();

// Phone validation
expect('555-0100').toBeValidPhone();

// ZIP code validation
expect('10001').toBeValidZipCode();

// Auth tokens validation
expect(authResponse).toHaveAuthTokens();

// Called once with specific args
expect(mockFn).toHaveBeenCalledOnceWith('arg1', 'arg2');

// User-friendly error messages
expect(errorMessage).toBeUserFriendlyError();

// ISO date strings
expect('2026-01-26T12:00:00Z').toBeISODateString();

// Valid profile
expect(profile).toBeValidProfile();

// Valid post
expect(post).toBeValidPost();
```

### Available Matchers

- `toBeValidEmail()` - Validates email format
- `toBeValidPhone()` - Validates phone number
- `toBeValidZipCode()` - Validates ZIP code (5 or 9 digits)
- `toHaveAuthTokens()` - Validates auth response has accessToken and _id
- `toHaveBeenCalledOnceWith(...args)` - Function called exactly once with args
- `toRenderWithoutErrors()` - Component renders without throwing
- `toBeUserFriendlyError()` - Error message is user-friendly
- `toBeISODateString()` - String is valid ISO date
- `toBeValidProfile()` - Profile has required fields
- `toBeValidPost()` - Post has required fields

## Scenarios

Reusable test scenarios for common patterns.

### Usage

```typescript
import {
  createAuthenticationScenarios,
  createLoadingStateScenarios,
  createPostOwnershipScenarios,
} from '@/__tests__/scenarios/commonScenarios';

describe('SignInScreen', () => {
  const authScenarios = createAuthenticationScenarios();

  it(authScenarios.successfulLogin.description, async () => {
    const mockLogin = jest.fn();
    const mockNavigate = jest.fn();

    authScenarios.successfulLogin.setup(mockLogin);

    // ... render component and trigger login

    await authScenarios.successfulLogin.assertions(mockLogin, mockNavigate);
  });
});
```

### Available Scenarios

**Authentication:**
- `createAuthenticationScenarios()` - Login, logout, errors

**Form Validation:**
- `createFormValidationScenarios(fieldName, testId)` - Required, valid, invalid

**Loading States:**
- `createLoadingStateScenarios()` - Loading indicators, disabled buttons

**Error Handling:**
- `createErrorHandlingScenarios()` - Error messages, retry logic

**Post Ownership:**
- `createPostOwnershipScenarios(Component, mockPost)` - Owner, non-owner, guest

**User Roles:**
- `createUserRoleScenarios(Component, baseProps)` - Default, admin, prime

**Data Transformation:**
- `createDataTransformationScenarios()` - String/boolean, string/number, field mapping

**Service Calls:**
- `createServiceCallScenarios(serviceName)` - Success, error, retry

**Navigation:**
- `createNavigationScenarios()` - Navigate on success, pass data

## Best Practices

### When to Use Factories

✅ **Use factories when:**
- Creating mock data for multiple tests
- Need consistent data structure across tests
- Testing with variations of same data
- Need edge case data (empty, long, special chars)

❌ **Don't use factories when:**
- Data is unique to one test
- Testing specific edge case values
- Inline data is more readable

### When to Use Custom Matchers

✅ **Use custom matchers when:**
- Same validation logic appears in multiple tests
- Domain-specific assertions make tests more readable
- Complex assertion logic can be encapsulated

❌ **Don't use custom matchers when:**
- Standard Jest matchers are sufficient
- Assertion is specific to one test
- Custom matcher would be too complex

### When to Use Scenarios

✅ **Use scenarios when:**
- Same test pattern appears across multiple files
- Testing common flows (auth, loading, errors)
- Want to ensure consistency across similar tests

❌ **Don't use scenarios when:**
- Test is unique to one component
- Scenario would need too many parameters
- Inline test is more readable

## Examples

### Example 1: User Authentication Test

```typescript
import { createMockUser, createMockAuthResponse } from '@/__tests__/factories/mockDataFactory';
import { createAuthenticationScenarios } from '@/__tests__/scenarios/commonScenarios';

describe('SignInScreen', () => {
  const authScenarios = createAuthenticationScenarios();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(authScenarios.successfulLogin.description, async () => {
    const mockUser = createMockUser();
    const mockAuthResponse = createMockAuthResponse();
    const mockLogin = jest.fn();
    const mockNavigate = jest.fn();

    authScenarios.successfulLogin.setup(mockLogin);

    const { getByTestId } = render(<SignInScreen />);

    fireEvent.changeText(getByTestId('email-input'), mockUser.email);
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByTestId('submit-button'));

    await authScenarios.successfulLogin.assertions(mockLogin, mockNavigate);
    expect(mockAuthResponse).toHaveAuthTokens();
  });
});
```

### Example 2: Post Component Test

```typescript
import { createMockTextPost, createPostOwnershipScenario } from '@/__tests__/factories/mockDataFactory';
import { createPostOwnershipScenarios } from '@/__tests__/scenarios/commonScenarios';

describe('TextPost', () => {
  const mockPost = createMockTextPost();
  const ownershipScenarios = createPostOwnershipScenarios(TextPost, mockPost);

  it(ownershipScenarios.ownerCanEdit.description, () => {
    ownershipScenarios.ownerCanEdit.test(render);
  });

  it('should handle edge case strings in title', () => {
    const longTitle = createMockTextPost({ title: 'A'.repeat(500) });
    const { getByText } = render(<TextPost {...longTitle} />);

    expect(getByText(longTitle.title)).toBeTruthy();
  });
});
```

### Example 3: Service Test

```typescript
import { createMockUser, createMockMyInfoProfile } from '@/__tests__/factories/mockDataFactory';
import { createServiceCallScenarios } from '@/__tests__/scenarios/commonScenarios';

describe('userProfileService', () => {
  const serviceScenarios = createServiceCallScenarios('updateProfile');
  const mockUser = createMockUser();
  const mockProfile = createMockMyInfoProfile();

  it(serviceScenarios.successfulCall.description, async () => {
    const mockService = jest.fn();
    serviceScenarios.successfulCall.setup(mockService, mockProfile);

    const result = await userProfileService.updateMyInfo(mockProfile);

    serviceScenarios.successfulCall.assertions(mockService, [mockProfile]);
    expect(result).toBeValidProfile();
  });
});
```

## Migration Guide

### Before (Without Utilities)

```typescript
it('should create user profile', async () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    DOB: '1990-01-01',
    roles: { User: 2001 }
  };

  const mockProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    phone: '555-0100',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA'
  };

  // Test implementation...

  expect(result.firstName).toBe('John');
  expect(result.lastName).toBe('Doe');
  expect(result.email).toBe('test@example.com');
  expect(/^\d{5}$/.test(result.zip)).toBe(true);
});
```

### After (With Utilities)

```typescript
it('should create user profile', async () => {
  const mockUser = createMockUser();
  const mockProfile = createMockMyInfoProfile();

  // Test implementation...

  expect(result).toBeValidProfile();
  expect(result.zip).toBeValidZipCode();
});
```

## Contributing

When adding new utilities:

1. **Factories**: Add to `mockDataFactory.ts` with TypeScript types
2. **Matchers**: Add to `customMatchers.ts` and update TypeScript declaration
3. **Scenarios**: Add to `commonScenarios.ts` with clear descriptions
4. **Document**: Update this README with usage examples
5. **Test**: Ensure utilities work in at least one test file

## Questions?

See [TESTING.md](../../../TESTING.md) for comprehensive testing standards.
