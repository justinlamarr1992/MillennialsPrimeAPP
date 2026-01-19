# Copilot Custom Instructions for Millennials Prime App

## Project Overview
This is a **React Native mobile application** (v1.1.6) built with Expo 53 and React Native 0.79.5. The app uses Firebase Authentication and follows a strict TypeScript-first approach.

### ⚠️ IMPORTANT: This is NOT Next.js
- **Platform**: React Native (iOS/Android mobile app)
- **NOT using**: Next.js, React Server Components, or 'use client' directives
- **Runtime**: Client-side only (mobile devices)
- All React hooks (useState, useEffect, useRef, etc.) work without 'use client'
- Do NOT suggest Next.js patterns or directives

---

## Code Quality Standards

### TypeScript Requirements (CRITICAL)
- **NEVER use `any` type** - This is a hard requirement with zero exceptions
- Always define explicit interfaces for component props
- Use proper type annotations for all function parameters and return values
- Prefer union types over `any` for flexible types
- When dealing with third-party libraries without types, create `.d.ts` declaration files in `/types/`

### Example - Good TypeScript:
```typescript
interface UserProfileProps {
  name: string;
  email: string;
  isPrime: boolean;
}

export default function UserProfile({ name, email, isPrime }: UserProfileProps) {
  // Component code
}
```

### Example - Bad (DO NOT DO):
```typescript
export default function UserProfile(props: any) {  // ❌ NEVER use any
  // Component code
}
```

---

## React Native Patterns

### Event Handlers
- Use React Native event types, NOT web event types
- For TextInput: Use `onChangeText={(text) => ...}` NOT `onChange`
- Event types: `NativeSyntheticEvent<TextInputChangeEventData>`

```typescript
// ✅ Correct
<TextInput
  value={email}
  onChangeText={(text) => setEmail(text)}
/>

// ❌ Wrong - This is web pattern
<TextInput
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### State Management
- Always use functional updater pattern when reading and writing the same state

```typescript
// ✅ Correct
setCount(prev => prev + 1);

// ❌ Wrong - Can cause stale closures
setCount(count + 1);
```

---

## Authentication & API Patterns

### Firebase Authentication (React Native Firebase)
- **IMPORTANT**: This app uses **React Native Firebase** (`@react-native-firebase/auth`), NOT Firebase Web SDK
- Import from: `@react-native-firebase/auth` (e.g., `import auth from '@react-native-firebase/auth'`)
- DO NOT import from `firebase/auth` - the Web SDK is NOT used
- Use namespaced API pattern: `auth().signInWithEmailAndPassword()` NOT `signInWithEmailAndPassword(auth, ...)`
- Use `user.getIdToken()` for API authorization tokens
- Auth persistence is handled automatically via native iOS Keychain/Android Keystore
- All auth operations use async/await pattern with React Native Firebase methods

### Axios Interceptors
- Token retrieval must include error handling with try-catch
- Implement token caching to prevent race conditions
- Log errors with user context for debugging

```typescript
// ✅ Correct pattern
try {
  const token = await user.getIdToken();
  config.headers["Authorization"] = `Bearer ${token}`;
} catch (err) {
  console.error(`Failed to get Firebase ID token for user ${user?.uid}:`, err);
  return Promise.reject(err);
}
```

---

## Async Operations

### Always Use async/await with try-catch-finally
NEVER mix `.then()/.catch()` with async operations in components.

```typescript
// ✅ Correct
const handleSubmit = async () => {
  setLoading(true);
  try {
    const result = await createUser(email, password);
    router.replace("/(auth)/SignInScreen");
  } catch (error) {
    setErrMsg(error.message);
  } finally {
    setLoading(false);  // ALWAYS runs
  }
};

// ❌ Wrong
const handleSubmit = async () => {
  setLoading(true);
  createUser(email, password)
    .then(() => router.replace("/(auth)/SignInScreen"))
    .catch(error => setErrMsg(error.message));
  setLoading(false);  // ❌ Runs immediately, before promise resolves
};
```

---

## Navigation

### Expo Router Patterns
- Use `router.push()` for standard navigation
- Use `router.replace()` for auth flows (prevents back button)
- Use `router.back()` for cancel/back actions
- For dynamic routes, use type casting: `router.push(\`/user/\${id}\` as Href)`

```typescript
import { router, Href } from 'expo-router';

// Dynamic navigation with type safety
const userId = "123";
router.push(`/user/${userId}` as Href);
```

---

## Styling & UI

### Color Theming
- Use `useColorScheme()` from React Native
- Access colors via `COLORS[colorScheme ?? "dark"]`
- NEVER hardcode color values in components

```typescript
import { useColorScheme } from "react-native";
import { COLORS } from "@/constants/Colors";

const colorScheme = useColorScheme();
const colors = COLORS[colorScheme ?? "dark"];

<Text style={{ color: colors.priT }}>Text</Text>
```

### Global Styles
- Prefer `globalStyles` from `@/constants/global`
- Avoid creating duplicate style definitions
- Check existing styles before adding new ones

---

## Import Organization

### Order Imports Properly
1. React/React Native imports
2. Third-party library imports
3. Internal hooks/utilities
4. Constants/types
5. Component imports
6. Styles

```typescript
// ✅ Correct order
import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import useAuth from "@/hooks/useAuth";
import { COLORS } from "@/constants/Colors";
import { globalStyles } from "@/constants/global";
```

### Avoid Duplicate Imports
- Check for existing imports before adding new ones
- Combine imports from same package

```typescript
// ✅ Correct
import { View, Text, TouchableOpacity } from "react-native";

// ❌ Wrong
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native";
```

---

## Error Handling

### Component Error Boundaries
- ErrorBoundary is implemented at root level
- Log errors using `logger.exception(error, context)`
- Never silence errors - always log or display them

### Firebase Errors
- Use specific Firebase error codes for user-friendly messages
- Create centralized error handlers for common operations
- React Native Firebase provides `.code` property on errors for error handling

```typescript
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const handleAuthError = (error: FirebaseAuthTypes.NativeFirebaseAuthError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    default:
      return 'An error occurred. Please try again';
  }
};
```

---

## Console Logs & Debugging

### Production Logging
- Use `logger` utility instead of `console.log`
- Remove debug console.logs before committing
- Keep error logs for production debugging

```typescript
import { logger } from '@/utils/logger';

// ✅ Development only
logger.log('Debug info:', data);

// ✅ Production-safe
logger.error('Error occurred:', error);

// ❌ Don't commit
console.log('temp debug');
```

---

## File Organization

### Component Structure
```
/app                  - Expo Router pages
/components           - Reusable UI components
/shared               - Business logic components
/hooks                - Custom React hooks
/context              - React Context providers
/constants            - Global constants, colors, styles
/types                - TypeScript type declarations
/utils                - Utility functions
/API                  - API configuration
```

### Naming Conventions
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase starting with "use" (e.g., `useAuth.ts`)
- Utilities: camelCase (e.g., `logger.ts`)
- Types: PascalCase for interfaces (e.g., `UserProfileProps`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

---

## Common Anti-Patterns to Avoid

### ❌ DO NOT:
1. Use `any` type (use `unknown` then narrow, or proper types)
2. Mix React Navigation and Expo Router patterns
3. Use `@ts-ignore` comments (fix the underlying type issue)
4. Create empty catch blocks (always handle or log errors)
5. Use web event patterns (`e.preventDefault()`, `e.target`, etc.)
6. Hardcode API URLs or keys (use environment variables)
7. Access `navigation.navigate()` - use expo-router instead
8. Create duplicate style definitions
9. Use inline styles for repeated patterns
10. Commit console.log statements
11. **Suggest Next.js patterns** (no 'use client', no server components, no app router)
12. **Suggest web-only React patterns** (this is React Native, not ReactDOM)

---

## Testing Standards (When Writing Tests)

### Test File Naming
- Test files: `ComponentName.test.tsx`
- Place tests in `__tests__` directory

### Priority Test Coverage
1. Authentication flows
2. Form validation
3. API error handling
4. Component rendering
5. User interactions

---

## PR & Review Guidelines

### Before Creating PR
- ✅ Run `npx tsc --noEmit` - MUST pass with 0 errors
- ✅ Remove all console.log statements
- ✅ Update relevant documentation
- ✅ Test on both iOS and Android if UI changes
- ✅ Verify no 'any' types introduced

### PR Description Must Include
- Summary of changes (what and why)
- Files changed with brief description
- Testing performed
- TypeScript verification passed
- Screenshots for UI changes

### Commit Messages
Use conventional commit format:
```
feat: Add user profile screen
fix: Resolve token refresh race condition
refactor: Simplify authentication flow
docs: Update API documentation
chore: Remove unused imports
```

---

## Environment & Configuration

### Environment Variables
- Never commit `.env` files
- Use `EXPO_PUBLIC_` prefix for client-side variables
- Access via `process.env.EXPO_PUBLIC_VARIABLE_NAME`
- Update `.env.example` when adding new variables

### Dependencies
- Firebase Authentication: `@react-native-firebase/auth` v23.8.3+
- Firebase Core: `@react-native-firebase/app` v23.8.3+
- Navigation: Expo Router (NOT React Navigation directly)
- State Management: React hooks + Context (no Redux)
- API Calls: Axios with interceptors
- Styling: StyleSheet (no styled-components)

---

## Performance Considerations

### Component Optimization
- Use `React.memo()` for components with static props
- Implement proper dependency arrays in useEffect
- Use `useMemo()` and `useCallback()` judiciously
- Avoid creating functions inside render

### Data Fetching
- Implement proper loading states
- Add error boundaries for async operations
- Consider implementing React Query or SWR for caching (future enhancement)

---

## Security Best Practices

### Authentication
- Always validate user tokens on API calls
- Never store sensitive data in AsyncStorage without encryption
- Implement proper session timeout handling
- Use Firebase security rules for backend protection

### API Security
- Always use HTTPS for API calls
- Implement request/response interceptors for auth
- Validate and sanitize user input
- Handle rate limiting gracefully

---

## Code Review Focus Areas

When reviewing code, Copilot should specifically check for:

1. **Type Safety**: Zero `any` types, proper interfaces
2. **Error Handling**: All async operations wrapped in try-catch
3. **Firebase Patterns**: Proper token retrieval and caching
4. **React Native Patterns**: Correct event handlers and state management
5. **Performance**: Proper dependency arrays, memoization where needed
6. **Security**: No exposed secrets, proper validation
7. **Consistency**: Follows established patterns in codebase
8. **Documentation**: Complex logic includes comments

---

## Quick Reference Commands

```bash
# Type checking
npx tsc --noEmit

# Run tests
npm test

# Start development server
npm start

# Lint code
npm run lint
```

---

## Additional Context

### Known Limitations
- Some features in `/app/TabsLater/` are inactive legacy code
- Backend API authentication strategy is being migrated
- Test infrastructure is minimal (future improvement needed)

### Current Priorities
1. Maintain 100% TypeScript type safety
2. Fix remaining health check issues
3. Improve test coverage
4. Performance optimization
5. Update outdated dependencies

---

**Last Updated**: January 19, 2026
**Health Score Target**: 95/100
**Current Health Score**: 83/100
