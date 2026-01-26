/**
 * ESLint Flat Config for test files
 * Enforces Jest and React Testing Library best practices
 */

import jest from 'eslint-plugin-jest';
import testingLibrary from 'eslint-plugin-testing-library';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    ignores: ['**/.history/**', '**/node_modules/**', '**/dist/**', '**/build/**'],
    plugins: {
      jest,
      'testing-library': testingLibrary,
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...jest.environments.globals.globals,
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    rules: {
      // Jest Rules - Ensure test quality
      'jest/expect-expect': 'error', // Tests must have assertions
      'jest/no-disabled-tests': 'warn', // Flag disabled tests (it.skip, describe.skip)
      'jest/no-focused-tests': 'error', // Prevent .only in tests
      'jest/no-identical-title': 'error', // Prevent duplicate test names
      'jest/no-commented-out-tests': 'warn', // Flag commented tests
      'jest/valid-expect': 'error', // Ensure expect() is used correctly
      'jest/valid-title': 'error', // Ensure test titles are valid strings
      'jest/prefer-to-have-length': 'warn', // Use .toHaveLength() over .length
      'jest/prefer-to-be': 'warn', // Use .toBe() for primitives
      'jest/prefer-to-contain': 'warn', // Use .toContain() for arrays
      'jest/prefer-equality-matcher': 'warn', // Use toBe/toEqual over toBeTruthy for equality
      'jest/prefer-strict-equal': 'warn', // Use toStrictEqual over toEqual
      'jest/prefer-spy-on': 'warn', // Prefer jest.spyOn over manual mocking
      'jest/require-top-level-describe': 'warn', // Tests should be in describe blocks
      'jest/consistent-test-it': ['warn', { fn: 'it' }], // Consistent use of 'it'
      'jest/max-nested-describe': ['warn', { max: 3 }], // Limit nesting depth
      'jest/no-conditional-in-test': 'warn', // Avoid if/switch in tests
      'jest/no-duplicate-hooks': 'error', // Prevent duplicate beforeEach/afterEach
      'jest/no-test-return-statement': 'error', // Tests shouldn't return values
      'jest/prefer-hooks-on-top': 'warn', // Hooks at top of describe block
      'jest/prefer-lowercase-title': ['warn', { ignore: ['describe'] }],

      // React Testing Library Rules - Encourage best practices
      'testing-library/await-async-queries': 'error', // Await async queries
      'testing-library/await-async-utils': 'error', // Await async utilities
      'testing-library/no-await-sync-queries': 'error', // Don't await sync queries
      'testing-library/no-container': 'warn', // Avoid using container
      'testing-library/no-debugging-utils': 'warn', // Remove debug() calls
      'testing-library/no-dom-import': ['error', 'react-native'], // Use correct import
      'testing-library/no-node-access': 'warn', // Avoid direct DOM access
      'testing-library/no-promise-in-fire-event': 'error', // fireEvent is sync
      'testing-library/no-render-in-lifecycle': 'error', // Don't render in hooks
      'testing-library/no-unnecessary-act': 'error', // Remove redundant act()
      'testing-library/no-wait-for-multiple-assertions': 'error', // One assertion per waitFor
      'testing-library/no-wait-for-side-effects': 'error', // waitFor for assertions only
      'testing-library/prefer-find-by': 'warn', // Use findBy over waitFor + getBy
      'testing-library/prefer-presence-queries': 'warn', // Use queryBy for non-existence
      'testing-library/prefer-screen-queries': 'off', // React Native uses render result
      'testing-library/prefer-user-event': 'off', // React Native doesn't have userEvent
      'testing-library/render-result-naming-convention': 'warn', // Consistent naming
    },
  },
];
