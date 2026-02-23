# Millennials Prime APP — Status Report

**Version:** 1.2.0 (Build 1) | **SDK:** Expo 54 / React Native 0.81.5 | **Date:** February 2026

---

## Project Overview

Millennials Prime is a React Native iOS/Android media platform targeting the millennial demographic.
The app delivers a curated video content feed (HBO-style sections), social networking (profiles,
connections, posts), and a creator upload pipeline built on BunnyCDN with TUS resumable uploads.
Authentication is Firebase email/password with a custom JWT refresh interceptor to a MongoDB/Express
backend hosted on Firebase Functions.

---

## Feature Status

| Feature                                            | Status                | Screens                                              | Services                         | Hooks                                     |
| -------------------------------------------------- | --------------------- | ---------------------------------------------------- | -------------------------------- | ----------------------------------------- |
| Auth — sign in / register / password recovery      | ✅ Production         | SignInScreen, RegisterScreen, PasswordRecoveryScreen | serverAuth                       | useAuth, useRefreshToken, useAxiosPrivate |
| Home — BunnyCDN video feed (HBO-style sections)    | ✅ Production         | HomePage                                             | —                                | useBunnyCDNVideos                         |
| Settings — Personal / Business / Artistry profiles | ✅ Production         | Settings, MyInfoScreen, BusinessScreen, ArtScreen    | userProfileService               | useUserProfile                            |
| Profile picture upload (base64 → backend)          | ✅ Production         | MyInfoScreen, EditProfileScreen                      | userProfileService               | useProfilePictureUpload                   |
| Video upload (Expo → BunnyCDN via TUS)             | ✅ Production         | UploadContentScreen                                  | videoUploadService               | useVideoUpload                            |
| Social — My Profile, Edit Profile                  | ✅ Built (tab hidden) | MyProfileScreen, EditProfileScreen                   | userProfileService, postsService | useUserProfile, useUserPosts              |
| Social — View other user profiles                  | ✅ Built (tab hidden) | [id].tsx                                             | userProfileService               | useUserProfileById                        |
| Social — Connections (send / accept / remove)      | ✅ Built (tab hidden) | ConnectedUsersScreen                                 | connectionService                | useConnections, useConnectionStatus       |
| Shows — Series listing and detail                  | 🔧 Scaffolded         | PrimeShow, ShowViewScreen                            | —                                | —                                         |
| Backend: Posts endpoints                           | ⏳ Pending            | —                                                    | postsService                     | useUserPosts                              |
| Backend: Connections endpoints                     | ⏳ Pending            | —                                                    | connectionService                | useConnections                            |
| Backend: Video metadata save                       | ⏳ Pending            | —                                                    | videoUploadService               | —                                         |

**Tab visibility:** Home and Settings are public-facing. Social, Upload, and Shows are built but
hidden (`href: null`) pending final backend readiness and product launch decision.

---

## Tech Stack

| Category              | Technology                                  | Version          |
| --------------------- | ------------------------------------------- | ---------------- |
| Framework             | Expo SDK                                    | 54.0.0           |
| Runtime               | React Native                                | 0.81.5           |
| Language              | TypeScript                                  | 5.9.2 (strict)   |
| Navigation            | Expo Router (file-based)                    | 6.0.23           |
| Auth                  | React Native Firebase Auth                  | 23.8.3           |
| Data fetching         | TanStack React Query                        | 5.90.5           |
| HTTP client           | Axios (with JWT interceptors)               | 1.7.2            |
| Video hosting         | BunnyCDN REST API                           | —                |
| Video upload protocol | TUS resumable uploads via tus-js-client     | 4.1.0            |
| Animations            | React Native Reanimated                     | 4.1.1            |
| Gestures              | React Native Gesture Handler                | —                |
| Bottom sheet          | @gorhom/bottom-sheet                        | 4.6.4            |
| Secure storage        | expo-secure-store                           | 15.0.8           |
| State (auth)          | React Context + Firebase onAuthStateChanged | —                |
| Build / Deploy        | EAS Build + EAS Submit → TestFlight         | —                |
| Test runner           | Jest + jest-expo                            | 29.2.1 / 54.0.17 |
| Component testing     | @testing-library/react-native               | 13.3.3           |
| E2E testing           | Maestro (YAML flows)                        | CLI              |
| CI/CD                 | GitHub Actions                              | —                |

---

## Test Metrics

| Metric                     | Value                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Total test files           | 64                                                                                                               |
| Total tests                | 1,166                                                                                                            |
| Test layers covered        | Service → Hook → Component → Screen (all layers)                                                                 |
| TDD discipline             | Enforced — tests written before implementation                                                                   |
| Custom test infrastructure | test-utils wrapper, mockDataFactory, customMatchers, commonScenarios                                             |
| Mocked dependencies        | Firebase, React Query, Expo Router, AsyncStorage, SecureStore, Reanimated, Gesture Handler, WebView, ImagePicker |
| E2E flows (Maestro)        | 5 user journey flows (auth sign-in, register, sign-out, home content, settings nav)                              |
| CI gate                    | GitHub Actions on all PRs targeting main                                                                         |

### Test File Distribution

| Layer                           | Files |
| ------------------------------- | ----- |
| Services                        | 5     |
| Hooks                           | 13    |
| Components (core)               | 11    |
| Components (shared)             | 14    |
| Screens (auth)                  | 4     |
| Screens (tabs)                  | 12    |
| Utils                           | 4     |
| Setup / utilities / integration | 8     |

---

## Architecture Highlights

### JWT Interceptor Pattern

`useAxiosPrivate` attaches access tokens to all authenticated requests and intercepts 401 responses
to silently refresh the token via `useRefreshToken` — transparent to all hooks and screens.
Reference: [hooks/useAxiosPrivate.ts](../hooks/useAxiosPrivate.ts)

### BunnyCDN + TUS Upload Pipeline

`useVideoUpload` orchestrates a 4-phase state machine (idle → authorizing → uploading → complete):

1. `videoUploadService.createBunnyCDNVideo()` — provision video slot on BunnyCDN
2. `videoUploadService.getUploadAuth()` — fetch TUS endpoint + signature from backend
3. `videoUploadService.performTusUpload()` — resumable chunk upload via tus-js-client
4. `videoUploadService.updateBunnyCDNMetadata()` — set title/description on BunnyCDN

Reference: [hooks/useVideoUpload.ts](../hooks/useVideoUpload.ts), [services/videoUploadService.ts](../services/videoUploadService.ts)

### React Query Caching Layer

`useBunnyCDNVideos` fetches the video library with a 5-minute stale time and 2 automatic retries.
All data hooks follow this React Query pattern for consistent loading/error/data states.
Reference: [hooks/useBunnyCDNVideos.ts](../hooks/useBunnyCDNVideos.ts)

### Expo SDK 54 / iOS 26 SDK Compliance

Upgraded from Expo SDK 53 → 54 to meet Apple's April 28, 2026 requirement to build apps with the
iOS 26 SDK. EAS production builds pinned to `macos-sequoia-15.6-xcode-26.0`. Deployment target
stays at iOS 15.1 — no user-facing runtime change.
Reference: [eas.json](../eas.json), [docs/IOS26_SDK_UPGRADE.md](IOS26_SDK_UPGRADE.md)

### Firebase Initialization Resilience

`@react-native-firebase/app` v23.x has no Expo config plugin. After any `expo prebuild --clean`,
`FirebaseApp.configure()` must be manually restored in `AppDelegate.swift`. The Podfile
post_install block suppresses the RNFB non-modular header warning for `use_frameworks! :static`

- Xcode 16+ compatibility. Reference: MEMORY.md — "Expo SDK Upgrade Lessons"

---

## Open Issues / Roadmap

| #   | Title                              | Status                 |
| --- | ---------------------------------- | ---------------------- |
| #44 | Build with iOS 26 SDK              | PR #75 — in review     |
| #46 | Backend: posts endpoints           | Pending implementation |
| #52 | Backend: connections — send/accept | Pending implementation |
| #53 | Backend: connections — remove      | Pending implementation |
| #76 | UI: header/tab bar corner polish   | Open                   |

---

## Resume-Ready Bullets

_Phrased for direct use in a resume, LinkedIn profile, or portfolio._

---

**Millennials Prime — React Native Mobile Application** _(Solo Developer, 2024–Present)_

- Architected and shipped a full-featured React Native media platform (iOS/Android) from scratch
  using Expo SDK 54, TypeScript (strict), Firebase Authentication, and a MongoDB/Express backend
  deployed on Firebase Functions.

- Engineered a video upload pipeline integrating Expo ImagePicker, BunnyCDN REST API, and the TUS
  resumable upload protocol (tus-js-client), enabling large-file uploads with real-time progress
  tracking and automatic recovery from interrupted connections.

- Implemented a JWT refresh interceptor using Axios and React Context, providing transparent token
  rotation across all authenticated API calls without user-visible re-authentication prompts.

- Applied strict Test-Driven Development (TDD) across all layers — services, hooks, components,
  and screens — resulting in 1,166 unit tests across 64 test files with a custom test utilities
  layer (mockDataFactory, customMatchers, commonScenarios) using Jest and
  @testing-library/react-native.

- Established a Maestro E2E test platform with 5 user journey flows covering auth, home content,
  settings navigation, and sign-out on both iOS and Android, and configured a GitHub Actions CI
  pipeline to gate all pull requests with automated type-check, lint, format, and unit test
  validation.

- Executed an Expo SDK 53 → 54 upgrade to achieve Apple App Store iOS 26 SDK compliance ahead of
  the April 2026 deadline, resolving RNFB non-modular header build errors, expo-file-system v19
  breaking API changes, and Firebase initialization loss from clean prebuild regeneration.

- Integrated TanStack React Query v5 for server state management with 5-minute caching, retry
  logic, and optimistic UI updates, delivering a smooth HBO-style video content feed from BunnyCDN.

- Built a social networking layer (profiles, connections, posts) with full TDD coverage and a
  hidden-tab feature flag pattern enabling zero-downtime activation upon backend readiness.

- Maintained zero TypeScript `any` violations throughout the codebase, enforced via an 8-phase
  pre-commit checklist and GitHub Copilot PR review integration.
