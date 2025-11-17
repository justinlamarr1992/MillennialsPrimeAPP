# ESLint + Prettier Setup

## Overview

This project uses **ESLint** for code quality checks and **Prettier** for code formatting, integrated together for a seamless development experience.

## What's Installed

### Core Tools
- **ESLint 9** - JavaScript/TypeScript linting
- **Prettier 3** - Code formatting
- **eslint-config-expo** - Expo's recommended ESLint rules
- **eslint-config-prettier** - Disables ESLint rules that conflict with Prettier
- **eslint-plugin-prettier** - Runs Prettier as an ESLint rule

## Configuration Files

### `.prettierrc.json`
Prettier formatting rules:
- Single quotes for strings
- Semicolons required
- 100 character line width
- 2 space indentation
- Trailing commas (ES5)

### `eslint.config.js`
ESLint rules:
- Expo base configuration
- TypeScript unused variable warnings (allows `_` prefix for intentionally unused vars)
- Console.log warnings (allows `console.warn` and `console.error`)
- React hooks enforcement
- No `var` keyword (use `const`/`let`)

### `.prettierignore`
Excludes build artifacts, dependencies, and generated files from formatting.

## Available Scripts

### Linting
```bash
npm run lint           # Check for code quality issues
npm run lint:fix       # Auto-fix linting issues where possible
```

### Formatting
```bash
npm run format         # Format all code files
npm run format:check   # Check if files are formatted (CI/CD)
```

### Type Checking
```bash
npm run type-check     # Run TypeScript compiler checks
```

### Complete Validation
```bash
npm run validate       # Run all checks: types + lint + format + tests
```

## IDE Integration

### VS Code
Install these extensions for the best experience:
1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier** (`esbenp.prettier-vscode`)

Add to `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Pre-commit Hooks (Optional)

To automatically format/lint before commits, install **husky** and **lint-staged**:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Add to `package.json`:
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## Common Issues

### ESLint Module Warning
If you see: `Warning: Module type of eslint.config.js is not specified`

This is harmless. The config uses ES modules (`import`) which is standard for ESLint 9.

### Prettier vs ESLint Conflicts
All conflicts are resolved by `eslint-config-prettier`. If you see conflicts:
1. Run `npm run format` first (Prettier)
2. Then run `npm run lint:fix` (ESLint)

### Files Not Being Linted
Check if the file is in `eslint.config.js` ignores or `.prettierignore`.

## CI/CD Integration

The `npm run validate` command runs all checks and is suitable for CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run validation
  run: npm run validate
```

This ensures:
- ✅ TypeScript compiles without errors
- ✅ ESLint rules pass
- ✅ Code is properly formatted
- ✅ All tests pass

## Benefits

1. **Consistent code style** across the team
2. **Catch bugs early** with linting rules
3. **Automated formatting** saves time
4. **Better code reviews** - focus on logic, not style
5. **IDE integration** - instant feedback while coding
6. **CI/CD ready** - validate code quality automatically

## Next Steps

1. Run `npm run format` to format all existing code
2. Set up your IDE with the recommended extensions
3. Consider adding pre-commit hooks for automatic checks
4. Add `npm run validate` to your CI/CD pipeline

---

**Last Updated:** November 17, 2025  
**Health Score Impact:** +2 points (Code Quality tooling established)
