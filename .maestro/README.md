# Maestro E2E Tests

End-to-end user journey tests using [Maestro](https://maestro.mobile.dev/).
These flows run against a real iOS simulator or Android emulator — covering what unit tests cannot:
native navigation, actual gesture input, and full render-to-screen validation.

## Setup

### Install Maestro CLI (one-time, macOS)

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### Set test credentials

Create two dedicated Firebase test accounts (one prime, one free), then add them to your
local `.env` file (already gitignored):

```
# .env — never committed
MAESTRO_PRIME_EMAIL=your-prime-test@example.com
MAESTRO_PRIME_PASSWORD=your-prime-test-password
MAESTRO_FREE_EMAIL=your-free-test@example.com
MAESTRO_FREE_PASSWORD=your-free-test-password
```

The `npm run test:e2e` scripts use `.maestro/run-tests.sh`, which sources `.env` automatically
before invoking Maestro. No manual `export` needed.

> **Never hardcode credentials in flow files.** Always use environment variables.

## Running Flows

### All flows (iOS simulator must be running with the app installed)

```bash
npm run test:e2e
```

### iOS only

```bash
npm run test:e2e:ios
```

### Android only (Android emulator must be running)

```bash
npm run test:e2e:android
```

### Single flow

```bash
.maestro/run-tests.sh test .maestro/flows/01-auth-signin.yaml
```

### With verbose output

```bash
maestro test .maestro/flows/ --format junit
```

## Flows

| File                             | Journey                                                                    |
| -------------------------------- | -------------------------------------------------------------------------- |
| `01-auth-signin.yaml`            | Launch → enter credentials → tap Login → assert Home tab                   |
| `02-auth-register.yaml`          | Launch → Create an Account → fill form → submit → assert Home tab          |
| `03-auth-signout.yaml`           | Sign in → tap Log Out tab → confirm sign out → assert back at sign-in      |
| `04-home-content.yaml`           | Sign in → assert "New Episodes" section loads within 10s                   |
| `05-settings-personal-info.yaml` | Sign in → Settings tab → Personal Information → assert form fields visible |

## Architecture Notes

- Each flow is self-contained (no shared subflows) — explicit and easy to debug independently
- `clearState: true` on `launchApp` ensures a clean session for every flow
- Placeholder-based `hint:` targeting is used for text inputs (matches `placeholder` prop)
- `testID`-based targeting used where available (e.g., `register-submit-button`)
- `timeout: 10000` on network-dependent assertions allows for API latency
- Android app ID: `com.justappin.MillennialsPrime_APP` — update `appId` at top of each flow or
  override via `--env APP_ID=com.justappin.MillennialsPrime_APP`

## Layer Relationship

```
Unit Tests (Jest, 1166 tests)       ← logic, services, hooks, components
E2E Tests (Maestro, 5 flows)        ← user journeys, native nav, real rendering
```

Maestro flows are **not** a replacement for unit tests — they cover the integration layer
that unit tests mock away (real navigation, real Firebase calls, real device rendering).
