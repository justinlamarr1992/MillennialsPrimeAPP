# Onboarding & Authentication Flow

## Overview

This diagram represents the complete user onboarding journey from first app launch through successful authentication. It includes welcome screen, registration, login, and password recovery paths with dual authentication (Firebase + MongoDB).

## Flow Diagram

```mermaid
flowchart TD
    Start([App Launch]) --> Welcome[Welcome Screen]

    Welcome -->|Tap 'Log In'| SignIn[Sign In Screen]
    Welcome -->|Tap 'Sign Up'| Register[Register Screen]

    subgraph Registration Flow
        Register --> RegForm[Fill Registration Form]
        RegForm --> RegValidate{Validation<br/>Pass?}
        RegValidate -->|No| RegErrors[Show Errors]
        RegErrors --> RegForm

        RegValidate -->|Yes| FirebaseReg[Create Firebase Account]
        FirebaseReg --> FirebaseRegCheck{Firebase<br/>Success?}

        FirebaseRegCheck -->|No| FirebaseError[Show Firebase Error]
        FirebaseError --> RegForm

        FirebaseRegCheck -->|Yes| MongoReg[Create MongoDB Profile]
        MongoReg --> MongoRegCheck{MongoDB<br/>Success?}

        MongoRegCheck -->|No| CleanupFB[Delete Firebase User]
        CleanupFB --> MongoError[Show Error:<br/>Registration Failed]
        MongoError --> RegForm

        MongoRegCheck -->|Yes| RegSuccess[Registration Success Alert]
    end

    RegSuccess --> SignIn

    subgraph Login Flow
        SignIn --> LoginForm[Enter Email & Password]
        LoginForm --> LoginValidate{Validation<br/>Pass?}
        LoginValidate -->|No| LoginErrors[Show Errors]
        LoginErrors --> LoginForm

        LoginValidate -->|Yes| FirebaseAuth[Firebase Authentication]
        FirebaseAuth --> FirebaseAuthCheck{Firebase<br/>Success?}

        FirebaseAuthCheck -->|No| FirebaseAuthError[Show Auth Error]
        FirebaseAuthError --> LoginForm

        FirebaseAuthCheck -->|Yes| MongoAuth[MongoDB Authentication]
        MongoAuth --> MongoAuthCheck{MongoDB<br/>Success?}

        MongoAuthCheck -->|No| MongoWarn[Show Warning<br/>Can Proceed]
        MongoAuthCheck -->|Yes| AuthSuccess[Authentication Success]

        MongoWarn --> HomePage
        AuthSuccess --> HomePage
    end

    SignIn -->|Tap 'Forgot Password'| PassRecovery[Password Recovery Screen]

    subgraph Password Recovery
        PassRecovery --> PassRecForm[Enter Email]
        PassRecForm --> PassRecValidate{Email<br/>Valid?}
        PassRecValidate -->|No| PassRecError[Show Error]
        PassRecError --> PassRecForm

        PassRecValidate -->|Yes| SendReset[Send Reset Email]
        SendReset --> SendCheck{Email<br/>Sent?}

        SendCheck -->|No| SendError[Show Error]
        SendError --> PassRecForm

        SendCheck -->|Yes| ResetSuccess[Success Alert:<br/>Check Email]
    end

    ResetSuccess --> SignIn

    HomePage[HomePage<br/>Main Content Feed]
    HomePage --> End([User Authenticated])

    style Welcome fill:#4CAF50,color:#fff
    style Register fill:#2196F3,color:#fff
    style SignIn fill:#2196F3,color:#fff
    style PassRecovery fill:#FF9800,color:#fff
    style HomePage fill:#9C27B0,color:#fff
    style RegErrors fill:#f44336,color:#fff
    style FirebaseError fill:#f44336,color:#fff
    style MongoError fill:#f44336,color:#fff
    style LoginErrors fill:#f44336,color:#fff
    style FirebaseAuthError fill:#f44336,color:#fff
    style PassRecError fill:#f44336,color:#fff
    style SendError fill:#f44336,color:#fff
```

## Key User Paths

### 1. New User Registration Path
```
Welcome → Register → Fill Form → Firebase Signup → MongoDB Profile → Success → Sign In → Authentication → HomePage
```

**Steps**: 8 steps
**Time**: ~3-5 minutes
**Validation Points**: Form validation, Millennials age check, email uniqueness

### 2. Existing User Login Path
```
Welcome → Sign In → Enter Credentials → Firebase Auth → MongoDB Auth → HomePage
```

**Steps**: 5 steps
**Time**: ~30 seconds
**Validation Points**: Email/password validation, account existence

### 3. Password Recovery Path
```
Sign In → Forgot Password → Enter Email → Send Reset → Check Email → (External: Reset Password) → Sign In → HomePage
```

**Steps**: 4 steps in-app + 1 external
**Time**: ~1-2 minutes in-app + email processing time

## Critical Decision Points

| Decision Point | Options | Impact |
|----------------|---------|--------|
| **Welcome Screen** | Log In / Sign Up | Determines authentication vs registration flow |
| **Firebase Registration** | Success / Failure | Continues to MongoDB or shows error |
| **MongoDB Registration** | Success / Failure | Completes registration or triggers cleanup |
| **MongoDB Authentication** | Success / Failure | Full features vs limited features (warning) |

## Authentication Gate Behavior

After successful authentication:
- **Root Layout** detects user object in AuthContext
- **Auto-redirect** from auth screens to HomePage
- **Tab Navigation** becomes accessible
- **Protected Routes** unlock

## Error Recovery Paths

### Registration Errors
- **Form validation fails** → User corrects fields
- **Firebase fails** → User retries with different email
- **MongoDB fails** → Firebase user deleted, user starts over

### Login Errors
- **Invalid credentials** → User retries or uses password recovery
- **MongoDB auth fails** → User can still access app with warning

### Password Recovery Errors
- **Email not found** → User checks email or registers
- **Network error** → User retries when connection restored

## Success Metrics

- **Registration Completion Rate**: % users who complete full flow
- **Login Success Rate**: % successful first-time logins
- **Password Recovery Usage**: % users who use recovery vs remember password
- **Time to First Login**: Duration from app install to first successful login

## Business Insights

1. **Dual Auth Complexity**: Adds robustness but potential friction point
2. **Age Gate** (Millennials 1981-1997): Intentional restriction for target audience
3. **Cleanup Logic**: Prevents orphaned accounts but requires retry on MongoDB failure
4. **Optional MongoDB**: Users can proceed without full server auth (graceful degradation)

## Related Documentation

- [Welcome Screen Wireframe](../wireframes/01-authentication/welcome-screen.md)
- [Sign In Screen Wireframe](../wireframes/01-authentication/signin-screen.md)
- [Register Screen Wireframe](../wireframes/01-authentication/register-screen.md)
- [Password Recovery Screen Wireframe](../wireframes/01-authentication/password-recovery-screen.md)

---

*User journey documented as of 2026-01-30*
