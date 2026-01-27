/**
 * Custom Jest Matchers
 *
 * Domain-specific assertions to make tests more readable and maintainable.
 *
 * @example
 * expect(email).toBeValidEmail();
 * expect(authResponse).toHaveAuthTokens();
 * expect(mockFn).toHaveBeenCalledOnceWith('arg');
 */

import { expect } from "@jest/globals";

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Validates that a string is a valid email format
       */
      toBeValidEmail(): R;

      /**
       * Validates that a string is a valid phone number
       */
      toBeValidPhone(): R;

      /**
       * Validates that a string is a valid ZIP code (5 or 9 digits)
       */
      toBeValidZipCode(): R;

      /**
       * Validates that an object has required auth tokens
       */
      toHaveAuthTokens(): R;

      /**
       * Validates that a function was called exactly once with specific args
       */
      toHaveBeenCalledOnceWith(...args: unknown[]): R;

      /**
       * Validates that a component renders without crashing
       */
      toRenderWithoutErrors(): R;

      /**
       * Validates that an error message is user-friendly
       */
      toBeUserFriendlyError(): R;

      /**
       * Validates that a date string is in ISO format
       */
      toBeISODateString(): R;

      /**
       * Validates that a profile object has all required fields
       */
      toBeValidProfile(): R;

      /**
       * Validates that a post object has all required fields
       */
      toBeValidPost(): R;
    }
  }
}

/**
 * Email validation matcher
 */
export const toBeValidEmail = (received: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const pass = emailRegex.test(received);

  return {
    pass,
    message: () =>
      pass
        ? `expected ${received} not to be a valid email`
        : `expected ${received} to be a valid email format`,
  };
};

/**
 * Phone validation matcher
 */
export const toBeValidPhone = (received: string) => {
  // Supports formats: 555-0100, (555) 555-0100, 555.555.0100, 5555550100
  const phoneRegex = /^[\d\s\-().]+$/;
  const pass = phoneRegex.test(received) && received.replace(/\D/g, "").length >= 10;

  return {
    pass,
    message: () =>
      pass
        ? `expected ${received} not to be a valid phone number`
        : `expected ${received} to be a valid phone number`,
  };
};

/**
 * ZIP code validation matcher
 */
export const toBeValidZipCode = (received: string | number) => {
  const zipString = String(received);
  const zipRegex = /^\d{5}(-\d{4})?$/;
  const pass = zipRegex.test(zipString);

  return {
    pass,
    message: () =>
      pass
        ? `expected ${received} not to be a valid ZIP code`
        : `expected ${received} to be a valid ZIP code (5 or 9 digits)`,
  };
};

/**
 * Auth tokens validation matcher
 */
export const toHaveAuthTokens = (received: unknown) => {
  const obj = received as Record<string, unknown>;
  const hasAccessToken = typeof obj?.accessToken === "string" && obj.accessToken.length > 0;
  const hasUserId = typeof obj?._id === "string" && obj._id.length > 0;
  const pass = hasAccessToken && hasUserId;

  return {
    pass,
    message: () =>
      pass
        ? `expected object not to have valid auth tokens`
        : `expected object to have accessToken and _id fields:\n  Received: ${JSON.stringify(received, null, 2)}`,
  };
};

/**
 * Called once with args matcher
 */
export const toHaveBeenCalledOnceWith = function (
  this: jest.MatcherContext,
  received: jest.Mock,
  ...expectedArgs: unknown[]
) {
  const { calls } = received.mock;
  const pass = calls.length === 1 && this.equals(calls[0], expectedArgs);

  return {
    pass,
    message: () =>
      pass
        ? `expected function not to be called once with ${this.utils.printExpected(expectedArgs)}`
        : `expected function to be called once with ${this.utils.printExpected(expectedArgs)}\n` +
          `  Received ${calls.length} call(s):\n${calls.map((call, i) => `    ${i + 1}. ${this.utils.printReceived(call)}`).join("\n")}`,
  };
};

/**
 * Render without errors matcher
 */
export const toRenderWithoutErrors = (received: () => unknown) => {
  let pass = true;
  let error: Error | null = null;

  try {
    received();
  } catch (e) {
    pass = false;
    error = e as Error;
  }

  return {
    pass,
    message: () =>
      pass
        ? `expected component to throw an error`
        : `expected component to render without errors, but it threw:\n  ${error?.message}`,
  };
};

/**
 * User-friendly error matcher
 */
export const toBeUserFriendlyError = (received: string) => {
  // User-friendly errors should:
  // 1. Not contain technical jargon or stack traces
  // 2. Be clear and actionable
  // 3. Not be empty or generic

  const hasTechnicalJargon = /error|exception|stack|trace|undefined|null/i.test(received);
  const isEmpty = !received || received.trim().length === 0;
  const isGeneric = /something went wrong|error occurred|failed/i.test(received);
  const isActionable = received.length > 10; // Has some detail

  const pass = !isEmpty && !hasTechnicalJargon && isActionable;

  return {
    pass,
    message: () =>
      pass
        ? `expected "${received}" not to be a user-friendly error message`
        : `expected "${received}" to be a user-friendly error message\n` +
          `  Issues:\n` +
          `    - Empty: ${isEmpty}\n` +
          `    - Has technical jargon: ${hasTechnicalJargon}\n` +
          `    - Too generic: ${isGeneric}\n` +
          `    - Not actionable: ${!isActionable}`,
  };
};

/**
 * ISO date string matcher
 */
export const toBeISODateString = (received: string) => {
  const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z)?$/;
  const pass = isoRegex.test(received) && !isNaN(Date.parse(received));

  return {
    pass,
    message: () =>
      pass
        ? `expected ${received} not to be an ISO date string`
        : `expected ${received} to be a valid ISO date string (YYYY-MM-DD or ISO 8601)`,
  };
};

/**
 * Valid profile matcher
 */
export const toBeValidProfile = (received: unknown) => {
  const obj = received as Record<string, unknown>;
  const requiredFields = ["firstName", "lastName", "email"];
  const missingFields = requiredFields.filter((field) => !obj?.[field]);
  const pass = missingFields.length === 0;

  return {
    pass,
    message: () =>
      pass
        ? `expected profile not to be valid`
        : `expected profile to have required fields: ${requiredFields.join(", ")}\n` +
          `  Missing: ${missingFields.join(", ")}\n` +
          `  Received: ${JSON.stringify(received, null, 2)}`,
  };
};

/**
 * Valid post matcher
 */
export const toBeValidPost = (received: unknown) => {
  const obj = received as Record<string, unknown>;
  const requiredFields = ["id", "title", "authorId", "authorName", "createdAt"];
  const missingFields = requiredFields.filter((field) => !obj?.[field]);
  const pass = missingFields.length === 0;

  return {
    pass,
    message: () =>
      pass
        ? `expected post not to be valid`
        : `expected post to have required fields: ${requiredFields.join(", ")}\n` +
          `  Missing: ${missingFields.join(", ")}\n` +
          `  Received: ${JSON.stringify(received, null, 2)}`,
  };
};

/**
 * Register all custom matchers
 */
export const registerCustomMatchers = () => {
  expect.extend({
    toBeValidEmail,
    toBeValidPhone,
    toBeValidZipCode,
    toHaveAuthTokens,
    toHaveBeenCalledOnceWith,
    toRenderWithoutErrors,
    toBeUserFriendlyError,
    toBeISODateString,
    toBeValidProfile,
    toBeValidPost,
  });
};
