# Senior Engineer's Ramp-Up Report: Millennials Prime App

## **What This App Is**

**Millennials Prime** is a React Native/Expo social media app (v1.1.6) for iOS/Android featuring:
- User-generated content (text, photos, videos)
- Admin "Prime News" posts
- Video streaming via Bunny CDN
- Firebase Authentication
- Settings/profile management

**Current Status:** Early stage - core auth works, basic feed implemented, many features disabled/planned

---

## **Tech Stack at a Glance**

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native 0.79.5 + Expo 53 |
| **Routing** | Expo Router (file-based) |
| **Auth** | Firebase Auth (email/password) |
| **Video** | Bunny CDN + WebView |
| **State** | Local useState + AsyncStorage (no Redux) |
| **API** | Axios + Cloud Functions |
| **UI** | LinearGradient, Bottom Sheets, Native components |
| **Navigation** | React Navigation (Stack + Tabs) |

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
- **Direct Firebase SDK calls** (no centralized auth context currently)
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

### ✅ **Working Now**
- Email/password auth (sign in, register, password reset)
- Home feed with video posts from Bunny CDN
- Basic settings navigation
- Logout flow
- Timer/countdown components
- Post differentiation (admin gold, prime red, regular gray)

### 🚧 **Planned/Disabled** (in `TabsLater/`)
- Social features (user profiles, connections)
- Upload functionality
- Show/episodes view
- E-commerce integration
- Comments modal (built but not integrated)

---

## **Data Flow Deep Dive**

```typescript
// Auth Flow
Firebase SDK → AsyncStorage (tokens) → Direct auth checks in components
                                      (No centralized context yet)

// Content Flow
HomePage → Bunny CDN API → Video metadata → VideoPost components
           (Library 147838)                  ↓
                                    WebView embed player

// Future API Flow (commented code)
axiosPrivate → Cloud Functions → { accessToken, _id, roles }
               (us-central1-millennialsprime.cloudfunctions.net/api)
```

---

## **Key Gotchas & Technical Debt**

1. **Auth Architecture in Transition**
   - `AuthProvider` commented out in app/_layout.tsx
   - Components call `getAuth()` directly (not scalable)
   - Refresh token hook exists but unused

2. **Hardcoded Credentials** ⚠️
   - Bunny CDN access key visible in HomePage.tsx
   - Firebase config exposed (typical for client apps but be aware)

3. **Disabled Features**
   - 3 major tabs commented out (Social, Upload, ShowView)
   - Settings screens exist but minimal functionality

4. **State Management**
   - No global state solution
   - Props drilling for theme colors
   - Consider Context API for auth/theme

5. **TypeScript Usage**
   - TSConfig present but type definitions minimal
   - Many `any` types likely (didn't see strict typing)

---

## **Your Next Steps (Recommended)**

As a senior engineer joining, I'd prioritize:

1. **Set up local environment**
   ```bash
   npm install
   npx expo start
   ```

2. **Test the auth flow** - Sign up, sign in, password reset

3. **Read these files in order:**
   - firebase/firebaseConfig.ts (auth setup)
   - app/_layout.tsx (app bootstrap)
   - app/(tabs)/(home)/HomePage.tsx (main feature)
   - shared/PostComponents/VideoPost.tsx (post rendering)

4. **Questions to ask the team:**
   - Why is AuthProvider disabled? Is migration planned?
   - What's the timeline for Social/Upload features?
   - Backend API status (Cloud Functions endpoints)?
   - Role system (5150 admin, 1984 prime) - where's it enforced?
   - Video moderation workflow?

5. **Low-hanging improvements** (if you want quick wins):
   - Enable AuthContext properly
   - Move hardcoded strings to constants
   - Add TypeScript interfaces for API responses
   - Extract theme colors to Context instead of prop drilling

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

**Technology: Firebase Authentication (Web SDK)**

**Setup Location:** `/firebase/firebaseConfig.ts`

```typescript
// Firebase config
- Project ID: millennialsprime
- API Key: AIzaSyBKQKpVGfoDr0UQwRubiOMCU0_rmInP8u8
- Auth persistence: AsyncStorage (for offline support)
```

**Authentication Methods:**

1. **Sign In** (`SignInScreen.tsx`)
   ```typescript
   - Uses: getAuth() + signInWithEmailAndPassword()
   - On success: Routes to /(tabs)/(home)/HomePage
   - On error: Displays error message
   ```

2. **Sign Up** (`RegisterScreen.tsx`)
   ```typescript
   - Uses: getAuth() + createUserWithEmailAndPassword()
   - Validates email format and strong password
   - Collects user metadata (name, DOB) but doesn't sync to backend
   - After registration: Routes to SignInScreen
   ```

3. **Password Recovery** (`PasswordRecoveryScreen.tsx`)
   ```typescript
   - Uses: getAuth() + sendPasswordResetEmail()
   - Sends password reset link to user's email
   - After sending: Routes back to SignInScreen
   ```

4. **Sign Out** (`LogOutScreen.tsx`)
   ```typescript
   - Uses: getAuth() + signOut()
   - Routes to /(auth)/SignInScreen
   ```

**Key Details:**
- Auth state persisted in AsyncStorage via `getReactNativePersistence()`
- No active AuthContext currently being used (commented out in provider)
- Each component imports `getAuth()` directly from Firebase
- No refresh token mechanism implemented yet (hook exists but unused)

---

This is a solid foundation for a social video app. The Firebase + Bunny CDN combo is smart (cheap, scalable). Main technical debt is the auth architecture refactor and getting those disabled features production-ready.
