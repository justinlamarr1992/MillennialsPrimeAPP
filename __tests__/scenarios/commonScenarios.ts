/**
 * Common Test Scenarios
 *
 * Reusable test scenarios to reduce duplication and ensure consistency.
 * These scenarios encapsulate common test patterns identified during review.
 *
 * @example
 * testEdgeCaseStrings('title', MyComponent, { propName: 'title' });
 * testAuthenticationFlow(mockLogin, mockNavigate);
 */

import { fireEvent, waitFor } from '@testing-library/react-native';
import type { RenderResult } from '@testing-library/react-native';

// Helper types for Testing Library query functions
type GetByFunction = (text: string | RegExp) => ReturnType<RenderResult['getByText']>;
type QueryByFunction = (text: string | RegExp) => ReturnType<RenderResult['queryByText']> | null;
type GetByTestIdFunction = (testId: string) => ReturnType<RenderResult['getByTestId']>;
type QueryByTestIdFunction = (testId: string) => ReturnType<RenderResult['queryByTestId']> | null;

/**
 * Edge Case String Testing
 *
 * Tests component behavior with various edge case strings
 */
export const testEdgeCaseStrings = <TRender = RenderResult>(
  fieldName: string,
  getComponent: (value: string) => TRender,
  assertions: {
    empty?: (rendered: TRender) => void;
    veryLong?: (rendered: TRender) => void;
    specialChars?: (rendered: TRender) => void;
    unicode?: (rendered: TRender) => void;
  }
) => {
  const scenarios = [
    {
      name: 'empty string',
      value: '',
      assertion: assertions.empty,
    },
    {
      name: 'very long string',
      value: 'A'.repeat(500),
      assertion: assertions.veryLong,
    },
    {
      name: 'special characters',
      value: 'Test & "special" <chars>',
      assertion: assertions.specialChars,
    },
    {
      name: 'unicode characters',
      value: 'José García Müller',
      assertion: assertions.unicode,
    },
  ];

  return scenarios.map((scenario) => ({
    description: `should handle ${scenario.name} in ${fieldName}`,
    test: () => {
      const rendered = getComponent(scenario.value);
      if (scenario.assertion) {
        scenario.assertion(rendered);
      }
    },
  }));
};

/**
 * Authentication Flow Testing
 *
 * Tests common authentication scenarios
 */
export const createAuthenticationScenarios = () => ({
  successfulLogin: {
    description: 'should successfully log in with valid credentials',
    setup: (mockLogin: jest.Mock) => {
      mockLogin.mockResolvedValue({
        accessToken: 'token-123',
        _id: 'user-456',
        roles: { User: 2001 },
      });
    },
    assertions: async (mockLogin: jest.Mock, mockNavigate: jest.Mock) => {
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockNavigate).toHaveBeenCalledWith('/home');
      });
    },
  },

  invalidCredentials: {
    description: 'should display error for invalid credentials',
    setup: (mockLogin: jest.Mock) => {
      mockLogin.mockRejectedValue({
        code: 'auth/invalid-credential',
        message: 'Invalid credentials',
      });
    },
    assertions: async (getByText: GetByFunction) => {
      await waitFor(() => {
        expect(getByText('Invalid email or password')).toBeTruthy();
      });
    },
  },

  networkError: {
    description: 'should display error for network failure',
    setup: (mockLogin: jest.Mock) => {
      mockLogin.mockRejectedValue({
        code: 'auth/network-request-failed',
        message: 'Network error',
      });
    },
    assertions: async (getByText: GetByFunction) => {
      await waitFor(() => {
        expect(getByText(/network error/i)).toBeTruthy();
      });
    },
  },
});

/**
 * Form Validation Scenarios
 *
 * Tests common form validation patterns
 */
export const createFormValidationScenarios = (
  fieldName: string,
  testId: string
) => ({
  requiredField: {
    description: `should show error when ${fieldName} is empty`,
    test: (getByTestId: GetByTestIdFunction, fireSubmit: () => void) => {
      const input = getByTestId(testId);
      fireEvent.changeText(input, '');
      fireSubmit();
      return getByTestId(`${testId}-error`);
    },
  },

  validInput: {
    description: `should accept valid ${fieldName}`,
    test: (getByTestId: GetByTestIdFunction, validValue: string) => {
      const input = getByTestId(testId);
      fireEvent.changeText(input, validValue);
      expect(() => getByTestId(`${testId}-error`)).toThrow();
    },
  },

  invalidInput: {
    description: `should show error for invalid ${fieldName}`,
    test: (getByTestId: GetByTestIdFunction, invalidValue: string, fireSubmit: () => void) => {
      const input = getByTestId(testId);
      fireEvent.changeText(input, invalidValue);
      fireSubmit();
      return getByTestId(`${testId}-error`);
    },
  },
});

/**
 * Loading State Scenarios
 *
 * Tests component behavior during async operations
 */
export const createLoadingStateScenarios = () => ({
  showsLoadingIndicator: {
    description: 'should display loading indicator while fetching',
    test: (getByTestId: GetByTestIdFunction) => {
      expect(getByTestId('loading-indicator')).toBeTruthy();
    },
  },

  hidesLoadingAfterSuccess: {
    description: 'should hide loading indicator after successful fetch',
    test: async (getByTestId: GetByTestIdFunction, queryByTestId: QueryByTestIdFunction) => {
      expect(getByTestId('loading-indicator')).toBeTruthy();

      await waitFor(() => {
        expect(queryByTestId('loading-indicator')).toBeNull();
      });
    },
  },

  hidesLoadingAfterError: {
    description: 'should hide loading indicator after error',
    test: async (queryByTestId: QueryByTestIdFunction) => {
      await waitFor(() => {
        expect(queryByTestId('loading-indicator')).toBeNull();
      });
    },
  },

  disablesButtonWhileLoading: {
    description: 'should disable submit button while loading',
    test: (getByTestId: GetByTestIdFunction) => {
      const button = getByTestId('submit-button');
      expect(button.props.disabled).toBe(true);
    },
  },
});

/**
 * Error Handling Scenarios
 *
 * Tests component error handling
 */
export const createErrorHandlingScenarios = () => ({
  displaysErrorMessage: {
    description: 'should display error message when operation fails',
    test: async (getByText: GetByFunction, errorMessage: string) => {
      await waitFor(() => {
        expect(getByText(errorMessage)).toBeTruthy();
      });
    },
  },

  allowsRetry: {
    description: 'should allow retry after error',
    test: async (getByText: GetByFunction, mockRetry: jest.Mock) => {
      const retryButton = getByText(/try again/i);
      fireEvent.press(retryButton);

      await waitFor(() => {
        expect(mockRetry).toHaveBeenCalled();
      });
    },
  },

  clearsErrorOnRetry: {
    description: 'should clear error message on retry',
    test: async (getByText: GetByFunction, queryByText: QueryByFunction, errorMessage: string) => {
      const retryButton = getByText(/try again/i);
      fireEvent.press(retryButton);

      await waitFor(() => {
        expect(queryByText(errorMessage)).toBeNull();
      });
    },
  },
});

/**
 * Post Ownership Scenarios
 *
 * Tests post/content ownership logic
 */
export const createPostOwnershipScenarios = (mockPost: { authorId: string; [key: string]: unknown }) => ({
  ownerCanEdit: {
    description: 'should show edit/delete options when user owns the post',
    props: { ...mockPost, currentUserId: mockPost.authorId },
    assertion: (getByTestId: GetByTestIdFunction) => {
      expect(getByTestId('post-menu')).toBeTruthy();
    },
  },

  nonOwnerCannotEdit: {
    description: 'should not show edit/delete options when user does not own post',
    props: { ...mockPost, currentUserId: 'different-user' },
    assertion: (queryByTestId: QueryByTestIdFunction) => {
      expect(queryByTestId('post-menu')).toBeNull();
    },
  },

  unauthenticatedCannotEdit: {
    description: 'should not show edit/delete options when not logged in',
    props: { ...mockPost, currentUserId: null },
    assertion: (queryByTestId: QueryByTestIdFunction) => {
      expect(queryByTestId('post-menu')).toBeNull();
    },
  },
});

/**
 * User Role Scenarios
 *
 * Tests component behavior with different user roles
 */
export const createUserRoleScenarios = (baseProps: Record<string, unknown>) => ({
  defaultUser: {
    description: 'should render with default user styling',
    props: { ...baseProps, isAdmin: false, isPrime: false },
  },

  adminUser: {
    description: 'should render with admin styling',
    props: { ...baseProps, isAdmin: true, isPrime: false },
    assertion: (getByTestId: GetByTestIdFunction) => {
      expect(getByTestId('admin-badge')).toBeTruthy();
    },
  },

  primeUser: {
    description: 'should render with prime user styling',
    props: { ...baseProps, isAdmin: false, isPrime: true },
    assertion: (getByTestId: GetByTestIdFunction) => {
      expect(getByTestId('prime-badge')).toBeTruthy();
    },
  },

  adminPrecedence: {
    description: 'should prioritize admin badge when user is both admin and prime',
    props: { ...baseProps, isAdmin: true, isPrime: true },
    assertion: (getByTestId: GetByTestIdFunction, queryByTestId: QueryByTestIdFunction) => {
      expect(getByTestId('admin-badge')).toBeTruthy();
      expect(queryByTestId('prime-badge')).toBeNull();
    },
  },
});

/**
 * Data Transformation Scenarios
 *
 * Tests data transformation logic
 */
export const createDataTransformationScenarios = () => ({
  stringToBoolean: {
    yes: { input: 'Yes', expected: true },
    no: { input: 'No', expected: false },
  },

  stringToNumber: {
    validZip: { input: '10001', expected: 10001 },
    invalidZip: { input: 'invalid', expected: null },
  },

  fieldMapping: {
    clientToServer: (clientField: string, serverField: string) => ({
      description: `should map ${clientField} to ${serverField}`,
      input: { [clientField]: 'value' },
      expected: { [serverField]: 'value' },
    }),
  },
});

/**
 * Async Service Call Scenarios
 *
 * Tests service integration patterns
 */
export const createServiceCallScenarios = (serviceName: string) => ({
  successfulCall: {
    description: `should call ${serviceName} with correct parameters`,
    setup: (mockService: jest.Mock, expectedResponse: unknown) => {
      mockService.mockResolvedValue(expectedResponse);
    },
    assertions: (mockService: jest.Mock, expectedArgs: unknown[]) => {
      expect(mockService).toHaveBeenCalledWith(...expectedArgs);
    },
  },

  errorHandling: {
    description: `should handle ${serviceName} error`,
    setup: (mockService: jest.Mock, error: Error) => {
      mockService.mockRejectedValue(error);
    },
    assertions: async (result: Promise<unknown>, expectedError: string) => {
      await expect(result).rejects.toThrow(expectedError);
    },
  },

  retryOnFailure: {
    description: `should retry ${serviceName} on failure`,
    setup: (mockService: jest.Mock, successResponse: unknown) => {
      mockService
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(successResponse);
    },
    assertions: async (mockService: jest.Mock) => {
      await waitFor(() => {
        expect(mockService).toHaveBeenCalledTimes(2);
      });
    },
  },
});

/**
 * Navigation Scenarios
 *
 * Tests navigation behavior
 */
export const createNavigationScenarios = () => ({
  navigatesOnSuccess: {
    description: 'should navigate to destination on success',
    test: async (mockNavigate: jest.Mock, expectedRoute: string) => {
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(expectedRoute);
      });
    },
  },

  doesNotNavigateOnError: {
    description: 'should not navigate when operation fails',
    test: (mockNavigate: jest.Mock) => {
      expect(mockNavigate).not.toHaveBeenCalled();
    },
  },

  passesDataToNextScreen: {
    description: 'should pass data to next screen',
    test: async (mockNavigate: jest.Mock, expectedRoute: string, expectedData: unknown) => {
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(expectedRoute, expectedData);
      });
    },
  },
});

/**
 * Helper function to run a scenario
 * Note: These are helper functions, not actual tests
 */
/* eslint-disable jest/expect-expect, jest/valid-title, jest/require-top-level-describe */
export const runScenario = (
  scenario: { description: string; test: (...args: unknown[]) => void | Promise<void> },
  ...args: unknown[]
) => {
  it(scenario.description, async () => {
    await scenario.test(...args);
  });
};

/**
 * Helper function to run multiple scenarios
 */
export const runScenarios = (
  scenarios: Record<string, { description: string; test: (...args: unknown[]) => void | Promise<void> }>,
  getArgs: () => unknown[]
) => {
  Object.values(scenarios).forEach((scenario) => {
    it(scenario.description, async () => {
      await scenario.test(...getArgs());
    });
  });
};
/* eslint-enable jest/expect-expect, jest/valid-title, jest/require-top-level-describe */
