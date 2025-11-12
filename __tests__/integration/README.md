# Integration Tests

This directory contains integration tests that verify complete user journeys and workflows.

## Current Coverage

### Auth Flow Integration (`authFlow.integration.test.tsx`)
- Complete user registration workflow
- Sign in after registration
- Error handling and recovery
- Form validation preventing invalid submissions

### HomePage Data Fetching (`homePageDataFetching.integration.test.tsx`)
- API data fetching with React Query
- Error handling and retry functionality
- Empty state handling
- Environment variable validation

## Philosophy

Integration tests focus on:
- **User journeys**: Complete workflows from start to finish
- **Behavior**: What the user experiences, not how it's implemented
- **Critical paths**: Registration → Sign In → Home Page
- **Error recovery**: How the app handles failures

Integration tests avoid:
- Testing implementation details
- Testing internal state or hooks directly
- Duplicating unit test coverage
- Testing framework internals (React Query, Firebase, etc.)

## Running Tests

```bash
npm test -- __tests__/integration
```
