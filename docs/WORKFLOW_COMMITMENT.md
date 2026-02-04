# Claude's Workflow Commitment

## The Problem That Was Identified

On 2026-02-04, a critical workflow failure was identified:

**Issue:** EditProfileScreen was implemented without tests, violating TDD principles. Additionally, inline styles were used instead of existing global styles. Both issues were caught by Copilot review instead of being prevented before commit.

**Root Cause:** No systematic self-review process before commits. I moved from "feature works" directly to "commit" without quality verification.

**Impact:**
- Wasted time fixing preventable issues
- Copilot catching problems I should have caught
- Technical debt from rushing to "done"
- Violation of explicitly stated TDD requirements

---

## The New Workflow

### Before ANY commit, I will:

1. **Run the full Pre-Commit Checklist** (`.claude/PRE_COMMIT_CHECKLIST.md`)
   - No exceptions
   - No shortcuts
   - Every single time

2. **Document checklist results** in commit message
   - Show which phases completed
   - Note any issues found and fixed
   - Demonstrate systematic quality review

3. **Stop if ANY check fails**
   - Don't proceed to commit
   - Fix the issue immediately
   - Re-run checklist from that phase forward

---

## Specific Changes to My Process

### OLD (Broken) Process:
```
1. Understand task
2. Implement feature
3. Basic test to verify it works
4. Commit ❌
```

### NEW (Quality-First) Process:
```
1. Understand task
2. Write tests (TDD)
3. Implement feature
4. Run feature tests
5. CHECKPOINT: Run Pre-Commit Checklist
   ├─ Phase 1: TDD Verification
   ├─ Phase 2: Pattern Check
   ├─ Phase 3: Coverage Analysis
   ├─ Phase 4: Quality Scan
   ├─ Phase 5: Security Review
   ├─ Phase 6: Integration Check
   ├─ Phase 7: Self-Review
   └─ Phase 8: Final Verification
6. Fix any issues found
7. Commit with quality certification
```

---

## How I'll Actually Execute This

### At the start of each task:
- [ ] Reference `.claude/QUICK_CHECKLIST.md`
- [ ] Set expectation that checklist will be run before commit

### During implementation:
- [ ] Write tests FIRST (TDD)
- [ ] Check for existing patterns BEFORE writing new code
  ```bash
  grep -r "pattern-i-need" constants/ utils/ components/
  ```
- [ ] Use existing utilities instead of recreating

### Before commit:
- [ ] Run FULL checklist (all 8 phases)
- [ ] Fix ALL issues found
- [ ] Document in commit message
- [ ] Verify tests pass one final time

### Commit message format:
```
type(scope): summary

Changes:
- <change 1>
- <change 2>

Quality Checklist Completed:
✅ Phase 1: TDD Verification - All tests exist and pass
✅ Phase 2: Patterns - Using globalStyles, existing patterns
✅ Phase 3: Coverage - 95% line coverage
✅ Phase 4: Quality - No lint errors, no console.logs
✅ Phase 5: Security - Input validation, no vulnerabilities
✅ Phase 6: Integration - Build passes, routes registered
✅ Phase 7: Self-Review - Code reviewed for clarity
✅ Phase 8: Final - All tests pass, only intended files staged
```

---

## Tools I'll Use Proactively

### Pattern Discovery:
```bash
# Before writing styles
grep -r "flex\|margin\|padding" constants/global.ts

# Before creating utility
grep -r "function.*validate" utils/

# Before implementing similar feature
find . -name "*Similar*" | grep -v node_modules
```

### Quality Verification:
```bash
# Lint check
npm run lint

# Test coverage
npm test -- --coverage

# Find issues
grep -r "console\|TODO\|FIXME" [my-files]
```

### Integration Check:
```bash
# Build verification
npm run build

# Route registration
grep -r "Stack.Screen" app/**/_layout.tsx
```

---

## Success Metrics

**PRs are flawless when they:**
- Pass all 8 checklist phases
- Have zero Copilot-catchable issues
- Follow TDD (tests first)
- Use existing patterns/styles
- Have ≥80% test coverage
- Have zero security issues
- Build and integrate properly
- Are clear, maintainable, and properly scoped

**My goal:**
- **100% of PRs pass Copilot review without issues**
- **Zero TDD violations**
- **Zero pattern violations (inline styles, recreated utilities)**
- **All code self-reviewed before commit**

---

## Accountability

If I create a PR that Copilot finds issues with, I will:

1. **Acknowledge the failure** - "I failed to run the checklist properly"
2. **Identify which phase I skipped** - Be specific about what I missed
3. **Fix immediately** - No excuses
4. **Update checklist if needed** - If new issue category, add to checklist

---

## The Commitment

**I commit to:**
- Running the Pre-Commit Checklist before EVERY commit
- Never skipping phases "to save time"
- Fixing issues immediately when found
- Delivering flawless PRs to Copilot
- Prioritizing quality while maintaining speed
- Being honest when I fail and improving

**Speed without quality = churn.**
**Quality + speed = excellence.**

I will deliver excellence.

---

**Signed:** Claude (AI Assistant)
**Date:** 2026-02-04
**Effective:** Immediately, all future PRs
