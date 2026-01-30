# MillennialsPrimeAPP Documentation

## Overview

Comprehensive reverse-engineered documentation of the MillennialsPrimeAPP including wireframes, user journeys, architecture details, and component catalogs. This documentation suite provides visual references for business alignment discussions and technical reference for development.

## Documentation Structure

```
docs/
├── README.md (this file)
├── architecture/           # Technical architecture
├── wireframes/            # Screen-by-screen wireframes
├── user-journeys/         # User flow diagrams
└── components/            # Component library documentation
```

## Quick Links

### Architecture Documentation
- [App Overview](./architecture/APP_OVERVIEW.md) - Tech stack, architecture patterns, data flow
- [Navigation Structure](./architecture/NAVIGATION_STRUCTURE.md) - Expo Router, navigation hierarchy
- [Feature Status](./architecture/FEATURE_STATUS.md) - Active vs hidden features, roadmap

### Wireframes
- [Authentication Wireframes](./wireframes/01-authentication/) - Welcome, SignIn, Register, Password Recovery (4 screens)
- [Home Tab Wireframes](./wireframes/02-home-tab/) - HomePage with video carousels
- [Settings Tab Wireframes](./wireframes/03-settings-tab/) - Settings hub, forms (5 screens)
- [Other Wireframes](./wireframes/07-other/) - LogOut screen

### User Journeys
- [Onboarding Flow](./user-journeys/onboarding-flow.md) - Registration & authentication journey
- [Main Navigation Flow](./user-journeys/main-navigation-flow.md) - Active tabs (Home, Settings, LogOut)
- [Settings Workflow](./user-journeys/settings-workflow.md) - 3-step form workflow
- [Future Features Flow](./user-journeys/future-features-flow.md) - Hidden tabs overview

### Component Documentation
- [Component Library](./components/COMPONENT_LIBRARY.md) - Reusable components (ContentCard, ProfilePicture, etc.)
- [Shared Components](./components/SHARED_COMPONENTS.md) - Feature-specific components (Posts, Users, Modals, etc.)

## App Statistics

- **Total Screens**: 21 screens
  - **Active**: 10 screens (Auth + Home + Settings + LogOut)
  - **Hidden**: 8 screens (Social, Upload, Shows tabs)
  - **Auxiliary**: 3 test screens
- **Tech Stack**: React Native 19, Expo, Firebase, MongoDB
- **Navigation**: Expo Router (file-based routing)
- **Authentication**: Dual system (Firebase + MongoDB)

## Key Features

### Active Features
- ✅ **Authentication**: Dual Firebase + MongoDB auth with Millennials age gate (1981-1997)
- ✅ **Home Tab**: Video content feed with Bunny CDN, HBO-style carousels
- ✅ **Settings Tab**: 3-step profile workflow (Personal → Business → Art)
- ✅ **LogOut**: Secure session termination

### Hidden Features (Production-Ready)
- 🔒 **Social Tab**: User connections, profiles, e-commerce (5 screens, 85% ready)
- 🔒 **Upload Tab**: User-generated content upload (1 screen, 60% ready)
- 🔒 **Shows Tab**: Premium show streaming (2 screens, 65% ready)

## For Business Stakeholders

### Primary Use Cases
1. **Verify Design Alignment**: Compare wireframes to owner's vision
2. **Feature Planning**: Understand active vs hidden features
3. **Roadmap Discussions**: Assess readiness of hidden features
4. **User Experience Review**: Analyze user journeys and flows

### Recommended Reading Order
1. [Feature Status](./architecture/FEATURE_STATUS.md) - What's active, what's hidden
2. [Onboarding Flow](./user-journeys/onboarding-flow.md) - First-time user experience
3. [Main Navigation Flow](./user-journeys/main-navigation-flow.md) - Daily usage patterns
4. [Future Features Flow](./user-journeys/future-features-flow.md) - Roadmap features

## For Developers

### Technical Documentation
- [App Overview](./architecture/APP_OVERVIEW.md) - Architecture, tech stack, design patterns
- [Navigation Structure](./architecture/NAVIGATION_STRUCTURE.md) - Routing, navigation hierarchy
- [Component Library](./components/COMPONENT_LIBRARY.md) - Reusable components reference

### Implementation Reference
- Wireframes include:
  - Component hierarchies
  - State management details
  - Validation rules
  - API integration points
  - Error handling patterns

## Mermaid Diagram Support

All diagrams use Mermaid syntax and can be rendered in:
- GitHub markdown preview
- VSCode with Mermaid extension
- Documentation sites (GitBook, Docusaurus)
- Mermaid Live Editor (https://mermaid.live)

## Maintenance

### Update Triggers
Update documentation when:
- New screen added or removed
- Navigation structure changes
- Feature status changes (hidden → active)
- Major UI/UX changes
- Component refactoring

### Documentation Ownership
- **Architecture**: Update when tech stack or patterns change
- **Wireframes**: Update when screen UI changes significantly
- **User Journeys**: Update when flows or navigation changes
- **Components**: Update when component APIs change

## Version Information

**Created**: 2026-01-30
**App Version**: As of latest commit
**React Native**: 19.0.0
**Expo SDK**: ~52.0.14
**Expo Router**: ~5.1.7

## Contributing

To update documentation:
1. Follow existing format and structure
2. Include Mermaid diagrams for visual flows
3. Reference file paths (app/path/to/file.tsx)
4. Maintain consistent terminology
5. Update related documents when making changes

## Tools Used

- **Mermaid**: Flowcharts, sequence diagrams, state machines
- **Markdown**: GitHub-flavored markdown
- **TypeScript**: Code examples and interfaces
- **Git**: Version control for documentation

---

**Questions or updates?** See individual section READMEs for more details.
