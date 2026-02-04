# Pre-Commit Quality Checklist

**Purpose:** Ensure every PR is flawless before it reaches Copilot review.

**When to use:** Run this checklist BEFORE every `git commit`. No exceptions.

---

## Phase 1: TDD Verification (30 seconds)

**For every new component/screen/service:**

```bash
# 1. Find the implementation file
# 2. Check if corresponding test file exists
find . -path "*/__tests__/*" -name "*[ComponentName].test.*"
```

**Checks:**
- [ ] Test file exists for every new implementation file
- [ ] Tests were written BEFORE implementation (verify git history if unclear)
- [ ] All tests pass: `npm test -- [ComponentName]`

**If ANY check fails:** STOP. Write tests first. This is non-negotiable.

---

## Phase 2: Pattern & Style Verification (60 seconds)

**Before writing ANY styles, check for existing patterns:**

```bash
# Check for global styles
grep -r "flexRow\|flex1\|flexJustify\|flexAlign" constants/global.ts

# Check for similar components
find . -name "*[SimilarComponent]*" | grep -v node_modules

# Check for existing utility functions
grep -r "function [utilityName]" utils/
```

**Checks:**
- [ ] No inline styles where global styles exist
  ```bash
  # Search your new files for inline style objects
  grep "style={{" [your-new-files]
  # If found, check if globalStyles has an equivalent
  ```
- [ ] Following existing patterns (check 2-3 similar files)
- [ ] Using existing utilities (not recreating functions)
- [ ] Consistent naming conventions with codebase

**Action:** If you wrote inline styles or recreated existing patterns, refactor NOW.

---

## Phase 3: Test Coverage Analysis (45 seconds)

**For the component/feature you just built:**

```bash
# Run tests with coverage
npm test -- --coverage --collectCoverageFrom="[your-file-path]"
```

**Checks:**
- [ ] Line coverage ≥ 80%
- [ ] Branch coverage ≥ 75%
- [ ] All critical paths tested (happy path, error cases, edge cases)
- [ ] Validation logic fully tested
- [ ] API calls/service methods tested

**Required test categories:**
- Initial render/content display
- User interactions (forms, buttons, navigation)
- Data population/state changes
- Error handling
- Edge cases (empty data, null values, etc.)

**Action:** If coverage is low, write more tests NOW.

---

## Phase 4: Code Quality Scan (90 seconds)

**Run these automated checks:**

```bash
# 1. Linting
npm run lint

# 2. Type checking (if TypeScript)
npx tsc --noEmit

# 3. Find TODOs/FIXMEs
grep -r "TODO\|FIXME" [your-changed-files]

# 4. Check for console.logs (should be logger)
grep -r "console\\.log\|console\\.error" [your-changed-files] | grep -v "test\|spec"

# 5. Find hardcoded values
grep -r "http://\|https://\|localhost" [your-changed-files] | grep -v "test\|spec"
```

**Checks:**
- [ ] No linting errors
- [ ] No type errors
- [ ] No unresolved TODOs/FIXMEs
- [ ] Using `logger` instead of `console.log`
- [ ] No hardcoded URLs/secrets
- [ ] No commented-out code blocks

**Action:** Fix all issues found.

---

## Phase 5: Security & Best Practices (60 seconds)

**Manual review of your changes:**

```bash
# View your changes
git diff --cached
```

**Security Checks:**
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities (properly escaped user input)
- [ ] No sensitive data in logs
- [ ] No secrets/API keys in code
- [ ] Proper input validation on all user inputs
- [ ] Proper error handling (no stack traces to user)

**Best Practices:**
- [ ] No over-engineering (YAGNI principle)
- [ ] No premature abstractions
- [ ] Functions have single responsibility
- [ ] No backwards-compatibility hacks for unused code
- [ ] Proper async/await error handling
- [ ] No deeply nested conditionals (>3 levels)

**Accessibility:**
- [ ] All interactive elements have `accessibilityLabel`
- [ ] Proper `accessibilityRole` set (button, switch, etc.)
- [ ] Complex interactions have `accessibilityHint`
- [ ] Images have `accessible={true}` and descriptive labels
- [ ] Forms have clear labels and error messages
- [ ] Color is not the only indicator (use text/icons too)

**Action:** Refactor if needed.

---

## Phase 6: Integration Verification (45 seconds)

**Ensure your code integrates properly:**

```bash
# 1. Check imports work
npm run build

# 2. Verify navigation is registered
grep -r "Stack.Screen.*name.*[YourScreen]" app/

# 3. Check for broken dependencies
npm run test -- --listTests | grep [YourFeature]
```

**Checks:**
- [ ] Build succeeds
- [ ] All routes properly registered
- [ ] All dependencies installed
- [ ] No circular dependencies
- [ ] Integration tests pass (if applicable)

**Action:** Fix integration issues.

---

## Phase 7: Final Review (120 seconds)

**Read your own code like you're reviewing someone else's PR:**

1. **Open each changed file**
2. **Read line by line** and ask:
   - Is this clear and maintainable?
   - Would another dev understand this?
   - Is there a simpler way?
   - Does this follow project conventions?
   - Is this properly tested?

3. **Check commit scope:**
   - [ ] Only related changes included
   - [ ] No accidental file changes
   - [ ] No debugging code left in

4. **Verify against original requirements:**
   - [ ] Solves the problem completely
   - [ ] No scope creep (extra features)
   - [ ] Matches acceptance criteria

**Action:** If you find issues, fix them NOW.

---

## Phase 8: Commit Preparation (30 seconds)

```bash
# 1. Stage only relevant files
git add [specific-files]

# 2. Review what's staged
git diff --cached

# 3. Run final test suite
npm test
```

**Final Checks:**
- [ ] All tests pass
- [ ] Only intended files staged
- [ ] Ready for commit message

---

## Commit Message Format

```
<type>(scope): <short summary>

- <detailed change 1>
- <detailed change 2>
- <fix/refactor description>

<why this change was needed>
<what problem it solves>
```

**Types:** feat, fix, test, refactor, docs, chore

---

## Expected Timeline

- **Total checklist time: ~6-8 minutes**
- **Catches 95%+ of issues before Copilot**
- **Saves hours of back-and-forth**

**Quality over speed, but speed comes from doing it right the first time.**

---

## Emergency Override

If you're tempted to skip ANY step:

**STOP.**

Ask yourself:
1. Why am I rushing?
2. Will this create technical debt?
3. Will I have to fix this later?
4. Is this what "flawless" looks like?

**If answer to 2-3 is YES, don't skip. Do it right.**

---

## Success Criteria

**A PR is ready to commit when:**
- ✅ All 8 phases completed
- ✅ All tests pass
- ✅ No Copilot-catchable issues remain
- ✅ You'd be proud to have your name on it

**Remember:** Speed without quality = churn. Quality + speed = excellence.
