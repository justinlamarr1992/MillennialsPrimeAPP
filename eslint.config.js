// https://docs.expo.dev/guides/using-eslint/
import expoConfig from 'eslint-config-expo';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'build/**',
      'web-build/**',
      'ios/**',
      'android/**',
      '__tests__/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      'coverage/**',
    ],
  },
  expoConfig,
  prettierConfig,
  {
    rules: {
      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // React
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
];
