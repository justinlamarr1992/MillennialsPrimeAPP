# Claude Code Project Guidelines

## Pull Requests

When creating PRs, keep descriptions concise. Follow the PR template in `docs/pull_request_template.md`.

Avoid restating every file change — focus on intent and key decisions.

**Template Structure:**
- **What**: One-sentence summary
- **Why**: Brief context or issue link
- **How**: Key implementation details (only if non-obvious)
- **Testing**: How it was verified

## Development Workflow

1. Follow TDD at all layers (service → hook → component)
2. Use pre-commit checklist (`docs/QUICK_CHECKLIST.md`)
3. Maintain 100% Copilot review pass rate
4. Target >80% test coverage for all new code
