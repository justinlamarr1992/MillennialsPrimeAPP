# Quick Pre-Commit Checklist

**Run before EVERY commit. ~6-8 minutes total.**

---

## ☑️ Phase 1: TDD (30s)
```bash
find . -path "*/__tests__/*" -name "*[ComponentName].test.*"
npm test -- [ComponentName]
```
- [ ] Tests exist & pass

---

## ☑️ Phase 2: Patterns (60s)
```bash
grep -r "flexRow\|flex1" constants/global.ts
grep "style={{" [your-files]
```
- [ ] No inline styles (use globalStyles)
- [ ] Following existing patterns
- [ ] Using existing utilities

---

## ☑️ Phase 3: Coverage (45s)
```bash
npm test -- --coverage --collectCoverageFrom="[your-file]"
```
- [ ] ≥80% line coverage
- [ ] All paths tested

---

## ☑️ Phase 4: Quality (90s)
```bash
npm run lint
grep -r "TODO\|FIXME\|console\\.log" [your-files]
```
- [ ] No lint errors
- [ ] No TODOs/console.logs
- [ ] No hardcoded values

---

## ☑️ Phase 5: Security & Accessibility (60s)
- [ ] Input validation
- [ ] No XSS/injection vulnerabilities
- [ ] No secrets in code
- [ ] Proper error handling
- [ ] Accessibility labels on interactive elements
- [ ] Proper accessibilityRole set

---

## ☑️ Phase 6: Integration (45s)
```bash
npm run build
grep -r "Stack.Screen.*[YourScreen]" app/
```
- [ ] Build succeeds
- [ ] Routes registered

---

## ☑️ Phase 7: Self-Review (120s)
- [ ] Read your code
- [ ] Check clarity & maintainability
- [ ] Verify requirements met
- [ ] No scope creep

---

## ☑️ Phase 8: Final (30s)
```bash
git add [files]
git diff --cached
npm test
```
- [ ] All tests pass
- [ ] Only intended files staged

---

**If ANY checkbox unchecked → FIX IT NOW**

Quality + Speed = Excellence
