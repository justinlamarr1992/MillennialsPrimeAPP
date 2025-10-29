# Millennials Prime App

A React Native social media platform for iOS and Android featuring user-generated content, video streaming, and community engagement.

**Version:** 1.1.6
**Platform:** React Native 0.79.5 + Expo 53
**Status:** Active Development - Core features operational, advanced features in progress

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- iOS Simulator (Mac) or Android Studio
- Expo CLI (installed automatically)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**

   Copy the example file and add your credentials:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   - Firebase credentials (authentication)
   - BunnyCDN credentials (video streaming)
   - API base URL

   **→ [Complete environment setup guide](docs/ENVIRONMENT_SETUP.md)** - Detailed instructions for all environments

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React Native 0.79.5 + Expo 53 | Cross-platform mobile |
| **Routing** | Expo Router | File-based navigation |
| **Authentication** | Firebase Auth | User management |
| **Video Delivery** | Bunny CDN | Video streaming & hosting |
| **State Management** | React Hooks + AsyncStorage | Local state & persistence |
| **HTTP Client** | Axios | API communication |
| **UI Components** | React Native + LinearGradient | Native components with theming |
| **Language** | TypeScript | Type safety |

**→ [More details on architecture and patterns](docs/ONBOARD.md#architecture-overview)**

---

## Features

### ✅ Currently Available
- **Authentication:** Email/password sign in, registration, password reset
- **Content Feed:** View posts with text, photos, and videos
- **Video Streaming:** Integrated Bunny CDN player
- **User Roles:** Admin (gold), Prime (red), Regular (gray) with visual distinctions
- **Settings:** Profile and account management screens
- **Dark/Light Mode:** Theme support

### 🚧 In Development
- Social features (user profiles, connections)
- Content upload functionality
- Comments and interactions
- E-commerce integration
- Show/episodes view

---

## Project Structure

```
MillennialsPrimeAPP/
├── app/                          # Main application (Expo Router)
│   ├── (auth)/                   # Authentication screens
│   │   ├── SignInScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── PasswordRecoveryScreen.tsx
│   ├── (tabs)/                   # Main app (tab navigation)
│   │   ├── (home)/               # Home feed
│   │   ├── (settings)/           # User settings
│   │   └── LogOutScreen.tsx
│   └── _layout.tsx               # Root layout with ErrorBoundary
├── components/                   # Reusable UI components
│   ├── ErrorBoundary.tsx         # Error handling component
│   └── __tests__/                # Test components
├── shared/                       # Shared components
│   ├── PostComponents/           # Post types (Video, Picture, Text)
│   ├── Modals/                   # Bottom sheets and modals
│   └── Timer/                    # Countdown components
├── context/                      # React Context
│   └── AuthContext.tsx
├── provider/                     # Context providers
│   └── AuthProvider.tsx
├── firebase/                     # Firebase configuration
│   └── firebaseConfig.ts
├── hooks/                        # Custom React hooks
├── API/                          # HTTP client setup
├── constants/                    # Theme colors & global styles
├── utils/                        # Utility functions
│   └── logger.ts                 # Logging utility
├── docs/                         # Documentation
│   ├── ONBOARD.md                # Detailed onboarding guide
│   ├── ERROR_BOUNDARY.md         # Error handling docs
│   ├── HEALTH_CHECK_REPORT.md    # Technical health report
│   └── EXECUTIVE_STATUS_REPORT.md # Executive summary
└── assets/                       # Images, fonts, etc.
```

**→ [Complete directory structure with descriptions](docs/ONBOARD.md#directory-structure)**

---

## Key Architecture Decisions

### File-Based Routing
Uses Expo Router with grouped layouts:
- `(auth)` - Public authentication screens
- `(tabs)` - Main authenticated app with tab navigation
- `(aux)` - Auxiliary screens (legal, about, etc.)

### Authentication Flow
Firebase Authentication with AsyncStorage persistence:
```
Landing → Sign In/Register → Home Feed → Content
                ↓
           Password Reset
```

**→ [Detailed authentication flow and implementation](docs/ONBOARD.md#authentication-flow)**

### Content Types
- **PrimeNewsPost** - Official announcements (admin only)
- **VideoPost** - User-generated video content
- **PicturePost** - Photo posts
- **TextPost** - Text-only updates

### User Roles
- `5150` - Admin (gold gradient styling)
- `1984` - Prime member (red gradient styling)
- Default - Regular user (gray gradient styling)

**→ [More on business logic and user roles](docs/ONBOARD.md#business-logic-notes)**

---

## Development Guidelines

### Environment Variables
Never commit sensitive credentials. Use `.env` file with:
```bash
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
# ... other Firebase configs

# API
EXPO_PUBLIC_API_BASE_URL=

# BunnyCDN
EXPO_PUBLIC_BUNNYCDN_ACCESS_KEY=
EXPO_PUBLIC_BUNNYCDN_LIBRARY_ID=
```

**→ [Environment Setup Guide](docs/ENVIRONMENT_SETUP.md)** - Complete guide covering:
- Development vs. production environments
- Security best practices
- Finding your credentials
- Troubleshooting common issues
- CI/CD integration

### Code Quality
- Use TypeScript types for all new components
- Follow functional component patterns with hooks
- Use the `logger` utility instead of `console.log`
- Implement error boundaries for new feature sections
- Write props interfaces for all components

**→ [Critical files and gotchas to be aware of](docs/ONBOARD.md#critical-files-to-know)**
**→ [Known technical debt and considerations](docs/ONBOARD.md#key-gotchas--technical-debt)**

### Theming
- Use `useColorScheme()` hook for light/dark mode
- Access theme colors via `COLORS[colorScheme]`
- Apply `LinearGradient` for role-based styling

---

## Documentation

### For Developers
- **[Onboarding Guide](docs/ONBOARD.md)** - **START HERE** - Comprehensive technical overview for new engineers
  - Architecture deep dive
  - Data flow patterns
  - Critical files reference
  - Technical debt documentation
  - Recommended next steps
- **[Environment Setup Guide](docs/ENVIRONMENT_SETUP.md)** - Environment configuration and credential management
  - Development, staging, and production setup
  - Security best practices
  - Troubleshooting environment issues
- **[Error Boundary Docs](docs/ERROR_BOUNDARY.md)** - Error handling implementation details
- **[Health Check Report](docs/HEALTH_CHECK_REPORT.md)** - Technical health assessment and improvement tracking

### For Stakeholders
- **[Executive Status Report](docs/EXECUTIVE_STATUS_REPORT.md)** - Non-technical progress summary and timeline

---

## Current Health Score: 95/100 ⭐

Recent improvements (October 29, 2025):
- ✅ Security vulnerabilities resolved (0 vulnerabilities)
- ✅ Real-time input validation implemented
- ✅ Data fetching caching with React Query
- ✅ Centralized error handling
- ✅ Environment configuration documented
- ✅ Authentication system stabilized
- ✅ Error handling implemented (ErrorBoundary)
- ✅ TypeScript type safety improved

See [Health Check Report](docs/HEALTH_CHECK_REPORT.md) for detailed status.

---

## Common Tasks

### Running Tests
```bash
# TypeScript type checking
npx tsc --noEmit

# Run specific screen
npx expo start
# Then press 'i' or 'a' and navigate to screen
```

### Building for Production
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

### Clearing Cache
```bash
npx expo start -c
```

### Resetting Project
```bash
npm run reset-project
```

---

## Troubleshooting

### Common Issues

**"Unable to resolve module"**
```bash
rm -rf node_modules
npm install
npx expo start -c
```

**Firebase auth not working**
- Check `.env` file has correct Firebase credentials
- Verify Firebase project is active in console
- **→ [Environment Setup Guide](docs/ENVIRONMENT_SETUP.md)** for detailed troubleshooting

**Video not playing**
- Verify BunnyCDN credentials in `.env`
- Check library ID is correct (currently: 147838)
- **→ [More on data flow and video integration](docs/ONBOARD.md#data-flow-deep-dive)**

**Build errors**
```bash
npx expo prebuild --clean
npx expo start -c
```

---

## Resources

### Expo Documentation
- [Expo Docs](https://docs.expo.dev/) - Official documentation
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing
- [EAS Build](https://docs.expo.dev/build/introduction/) - Cloud builds

### React Native
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

### Project-Specific
- [Firebase Console](https://console.firebase.google.com/project/millennialsprime)
- [Bunny CDN Dashboard](https://dash.bunny.net/)

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes with proper TypeScript types
3. Test thoroughly on both iOS and Android
4. Update documentation if needed
5. Create a pull request with clear description

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `chore/` - Maintenance tasks

---

## Support

For technical questions or issues:
1. Check the [Onboarding Guide](docs/ONBOARD.md) first
2. Review relevant documentation in `docs/`
3. Contact the technical lead

---

## License

Proprietary - All rights reserved

---

**Last Updated:** October 29, 2025
**Maintained By:** Development Team
