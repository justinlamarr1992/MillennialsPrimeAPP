# Senior Engineer's Ramp-Up Report: Millennials Prime App

**Last Updated:** January 30, 2026

## **What This App Is**

**Millennials Prime** is a React Native/Expo social media app (v1.1.6+) for iOS/Android featuring:
- User-generated content (text, photos, videos)
- Admin "Prime News" posts
- Video streaming via Bunny CDN
- Dual Authentication (Firebase + MongoDB)
- Comprehensive profile management
- Millennials-focused (born 1981-1997)

**Current Status:** Production-ready core features with 3 hidden features ready for progressive rollout

---

## **Tech Stack at a Glance**

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native 19.0.0 + Expo SDK ~52.0.14 |
| **Routing** | Expo Router ~5.1.7 (file-based) |
| **Auth** | Dual: Firebase Auth + MongoDB JWT |
| **Video** | Bunny CDN + WebView |
| **State** | React Query + AuthContext + SecureStore |
| **Database** | MongoDB (server-side profiles) |
| **API** | Axios with JWT interceptors |
| **UI** | LinearGradient, Bottom Sheets, Native components |
| **Navigation** | React Navigation 19.0.0 (Stack + Tabs + Drawer) |

---

## **Architecture Overview**

```
User Flow:
Landing (index.tsx) → Sign In/Register → Home Feed (tabs) → Settings
                                              ↓
                                    Content Posts (text/photo/video)
```

**Key Patterns:**
- **File-based routing** with grouped layouts: `(auth)`, `(tabs)`, `(aux)`
- **Component composition** for posts with gradient styling by user role
- **Centralized auth** via AuthProvider context with dual authentication
- **Secure token storage** using expo-secure-store (iOS Keychain/Android Keystore)
- **React Query** for data fetching and caching (user profiles, content)
- **Theme support** via useColorScheme hook (light/dark colors)

---

## **Critical Files to Know**

| Priority | File | Why It Matters |
|----------|------|----------------|
| 🔴 | app/(tabs)/(home)/HomePage.tsx | Main feed logic, Bunny CDN integration |
| 🔴 | firebase/firebaseConfig.ts | Auth setup, API keys |
| 🔴 | app/(auth)/SignInScreen.tsx | Login flow |
| 🟡 | constants/global.ts | All global styles |
| 🟡 | shared/PostComponents/ | Post rendering system |
| 🟡 | app/(tabs)/_layout.tsx | Tab navigation config |
| 🟢 | API/axios.tsx | HTTP client setup |

---

## **Recent Development Activity**

Looking at commit history, recent work focused on:
- **"prebuild works"** (latest) - Native build configuration
- **Firebase sift delegate config** - Auth optimization
- **Expo linking debugging** - Deep linking setup
- **v1.1.5** - Password reset functionality
- **v1.1.4** - Working build with bonuses feature

**Trend:** Stabilizing core auth + video infrastructure

---

## **What's Working vs. Planned**

### ✅ **Active Features** (Production)
- **Dual Authentication**: Firebase + MongoDB with secure token storage
- **Home Feed**: Video content from Bunny CDN with HBO-style carousels
- **Settings Workflow**: 3-step profile forms (Personal → Business → Art)
- **Profile Pictures**: Upload with base64 conversion
- **Logout Flow**: Secure dual-auth cleanup
- **Age Gate**: Millennials-only validation (1981-1997)
- **Test Suite**: 717 tests passing (100% pass rate)

### 🔒 **Hidden Features** (Ready for Progressive Rollout)
**Toggled via `href: null` in tab config - remove to enable:**
- **Social Tab** (5 screens, 85% ready): User profiles, connections, e-commerce
- **Upload Tab** (1 screen, 60% ready): User-generated content upload
- **Shows Tab** (2 screens, 65% ready): Premium show streaming

**See:** [docs/architecture/FEATURE_STATUS.md](./architecture/FEATURE_STATUS.md) for detailed roadmap

---

## **Data Flow Deep Dive**

```typescript
// Dual Auth Flow
1. Firebase Authentication (User Identity)
   Firebase SDK → User object → AuthProvider Context

2. MongoDB Authentication (API Access)
   serverAuth.loginToServer() → JWT tokens → SecureStore (encrypted)
   Automatic refresh via axios interceptors

// Profile Data Flow
AuthProvider → useUserProfile hook → React Query → MongoDB API
                                                  ↓
                                    Cache + auto-refresh

// Content Flow
HomePage → Bunny CDN API → Video metadata → ContentCarousel
           (Library 147838)                  ↓
                                    ContentCard → VideoPost components
                                                  ↓
                                            WebView embed player

// API Requests
axiosPrivate → JWT from SecureStore → Cloud Functions
               Auto-refresh on 401   ↓
                                    MongoDB responses
```

---

## **Key Architecture Decisions & Notes**

1. **Dual Authentication System** ✅
   - Firebase handles user identity and app access
   - MongoDB provides API access tokens (JWT)
   - Automatic cleanup prevents orphaned accounts
   - Tokens encrypted in SecureStore (hardware-backed)

2. **Progressive Feature Release** 🔒
   - 3 complete features hidden via `href: null` toggle
   - Allows staged rollout without code deployment
   - Social, Upload, Shows tabs ready but disabled

3. **Data Persistence**
   - User profiles: MongoDB (via React Query cache)
   - Auth tokens: SecureStore (iOS Keychain/Android Keystore)
   - Video content: Bunny CDN (library 147838)

4. **TypeScript Standards** ✅
   - Strict typing enforced (no `any` types)
   - Proper error handling with `unknown` types
   - 100% TypeScript coverage

5. **Test Coverage** ✅
   - 717 tests passing (100% pass rate)
   - Test execution: <2 seconds
   - Comprehensive auth flow coverage

**See comprehensive documentation:** [docs/README.md](./README.md)

---

## **Your Next Steps (Recommended)**

As a senior engineer joining, I'd prioritize:

1. **Set up local environment**
   ```bash
   npm install
   npx expo start
   ```

2. **Test the auth flow**
   - Sign up (Millennials 1981-1997 only)
   - Sign in with dual auth
   - Complete settings workflow
   - Test profile picture upload

3. **Read documentation in order:**
   - [docs/README.md](./README.md) - Documentation index
   - [docs/architecture/APP_OVERVIEW.md](./architecture/APP_OVERVIEW.md) - Tech stack & architecture
   - [docs/user-journeys/onboarding-flow.md](./user-journeys/onboarding-flow.md) - User flows
   - [docs/wireframes/README.md](./wireframes/README.md) - Screen wireframes

4. **Read critical code files:**
   - app/_layout.tsx (root layout + auth gating)
   - provider/AuthProvider.tsx (auth context)
   - services/serverAuth.ts (MongoDB JWT auth)
   - app/(tabs)/(home)/HomePage.tsx (main feature)

5. **Questions to ask the team:**
   - Timeline for enabling Social/Upload/Shows tabs?
   - Video content moderation workflow?
   - Analytics/tracking requirements?
   - Payment integration plans for e-commerce?

6. **Potential improvements:**
   - Add video playback tracking/analytics
   - Implement push notifications
   - Add content search functionality
   - Optimize React Query cache strategies

---

## **Business Logic Notes**

**User Roles:**
- `5150` = Admin (gold gradient posts)
- `1984` = Prime member (red gradient posts)
- Default = Regular user (gray gradient posts)

**Content Types:**
- **PrimeNewsPost** - Official announcements (admin only)
- **VideoPost** - User videos (Bunny CDN hosted)
- **PicturePost** - Photo posts
- **TextPost** - Text-only updates

**Monetization Hints:**
- E-commerce components exist (shared/EComm/)
- Ad component with countdown timer
- "Bonuses" mentioned in commits

---

## **Directory Structure**

```
/Users/username/projects/MillennialsPrimeAPP/
├── app/                          # Expo Router file-based routing (main app)
│   ├── (auth)/                   # Auth group - public screens
│   │   ├── SignInScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── PasswordRecoveryScreen.tsx
│   │   ├── AboutScreen.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/                   # Main app navigation (tab-based)
│   │   ├── (home)/               # Home tab
│   │   │   ├── HomePage.tsx
│   │   │   └── _layout.tsx
│   │   ├── (settings)/           # Settings tab
│   │   │   ├── Settings.tsx
│   │   │   ├── MyInfoScreen.tsx
│   │   │   ├── BusinessScreen.tsx
│   │   │   ├── ArtScreen.tsx
│   │   │   └── _layout.tsx
│   │   ├── LogOutScreen.tsx
│   │   ├── _layout.tsx           # Tab navigation setup
│   ├── (aux)/                    # Auxiliary screens
│   │   └── disclaimer.tsx
│   ├── TabsLater/                # Future screens (currently disabled)
│   │   ├── (social)/             # Social/User profiles (future)
│   │   ├── (showview)/           # Show/Episodes view (future)
│   │   └── (upload)/             # Upload content (future)
│   ├── index.tsx                 # Landing page (login/signup choice)
│   ├── _layout.tsx               # Root layout wrapper
│   ├── modal.tsx
│   └── pagetwo.tsx
├── components/                   # Reusable UI components (minimal use)
├── shared/                       # Shared components & utilities
│   ├── PostComponents/           # Post types
│   │   ├── PrimeNewsPost.tsx     # Admin/news posts
│   │   ├── VideoPost.tsx         # User video posts
│   │   ├── PicturePost.tsx       # User photo posts
│   │   ├── TextPost.tsx          # Text-only posts
│   │   └── UserInfo.tsx          # Post author info
│   ├── Modals/
│   │   ├── CustomBottomSheet.tsx
│   │   └── CommentModal.tsx
│   ├── Timer/                    # Countdown timers
│   │   ├── DHMSTimer.tsx
│   │   ├── HMSTimer.tsx
│   │   └── NumberCard.tsx
│   ├── ShowView/                 # Content cards
│   ├── EComm/                    # E-commerce components
│   ├── ConnectedUser/
│   ├── Upload/
│   ├── Ad.tsx
│   └── LikeComment.tsx
├── context/                      # React Context (currently mostly disabled)
│   └── AuthContext.tsx
├── provider/                     # Context providers
│   └── AuthProvider.tsx          # Auth state management (mostly commented)
├── firebase/
│   └── firebaseConfig.ts         # Firebase initialization & auth
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Access AuthContext
│   ├── useAxiosPrivate.ts        # Axios with auth interceptors
│   ├── useRefreshToken.ts
│   ├── useColorScheme.ts
│   └── useThemeColor.ts
├── API/                          # HTTP client setup
│   └── axios.tsx                 # Axios instances (public & private)
├── constants/
│   ├── Colors.ts                 # Theme colors (light/dark mode)
│   └── global.ts                 # Global styles (StyleSheet)
├── assets/                       # Images & fonts
│   ├── images/
│   └── fonts/
├── screens/                      # (Legacy, mostly unused)
├── routes/                       # (Legacy routing)
├── firebase/                     # Firebase config
├── config.tsx                    # API base URL config
├── app.json                      # Expo config
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── metro.config.js              # Metro bundler config
```

---

## **Authentication Flow**

**Technology: Dual Authentication System**

**Setup Locations:**
- Firebase: `/firebase/firebaseConfig.ts`
- MongoDB: `/services/serverAuth.ts`
- Context: `/provider/AuthProvider.tsx`

**Dual Authentication Architecture:**

1. **Firebase Authentication** (User Identity)
   ```typescript
   - Project ID: millennialsprime
   - Handles: User credentials, session persistence
   - Storage: Firebase manages internally
   ```

2. **MongoDB Authentication** (API Access)
   ```typescript
   - Provides: JWT access/refresh tokens
   - Storage: SecureStore (iOS Keychain/Android Keystore)
   - Auto-refresh: Axios interceptors handle token refresh
   ```

**Authentication Methods:**

1. **Sign In** (`SignInScreen.tsx`)
   - Firebase: `auth().signInWithEmailAndPassword()`
   - MongoDB: `serverAuth.loginToServer()`
   - Success: Navigate to HomePage
   - Failure: Show specific error messages

2. **Sign Up** (`RegisterScreen.tsx`)
   - Validates: Email, password, DOB (Millennials 1981-1997)
   - Firebase: `auth().createUserWithEmailAndPassword()`
   - MongoDB: `serverAuth.registerOnServer()`
   - Cleanup: Deletes Firebase user if MongoDB fails
   - Success: Navigate to SignInScreen

3. **Password Recovery** (`PasswordRecoveryScreen.tsx`)
   - Firebase: `auth().sendPasswordResetEmail()`
   - Sends reset link via email
   - Success: Navigate to SignInScreen

4. **Sign Out** (`LogOutScreen.tsx`)
   - Firebase: `auth().signOut()`
   - MongoDB: `serverAuth.logout()` (clears tokens)
   - Success: Navigate to SignInScreen

**Key Details:**
- AuthProvider wraps entire app, manages global auth state
- Root layout implements auth gating (redirect based on user state)
- Tokens encrypted and hardware-backed via expo-secure-store
- Automatic JWT refresh via axios interceptors

---

## **Additional Resources**

**📚 Comprehensive Documentation (NEW - Jan 30, 2026):**
- [Documentation Index](./README.md) - Start here
- [Architecture Overview](./architecture/APP_OVERVIEW.md) - Tech stack, patterns, security
- [Navigation Structure](./architecture/NAVIGATION_STRUCTURE.md) - Routing, navigation hierarchy
- [Feature Status & Roadmap](./architecture/FEATURE_STATUS.md) - Active vs hidden features
- [User Journey Diagrams](./user-journeys/README.md) - Visual user flows
- [Screen Wireframes](./wireframes/README.md) - Screen-by-screen documentation
- [Component Library](./components/COMPONENT_LIBRARY.md) - Reusable components

**📊 Recent Reports:**
- [Executive Status Report](./EXECUTIVE_STATUS_REPORT.md) - Jan 24, 2026
- [Authentication Audit](./authentication-audit-report.md) - Jan 18, 2026
- [Test Review Findings](./review-findings/) - Jan 27, 2026

---

**Summary:** This is a well-architected social video app with production-ready core features and a strategic progressive rollout plan for advanced features. The dual authentication system, secure token storage, and comprehensive test coverage demonstrate production readiness. The Firebase + Bunny CDN combination provides a scalable, cost-effective infrastructure.
