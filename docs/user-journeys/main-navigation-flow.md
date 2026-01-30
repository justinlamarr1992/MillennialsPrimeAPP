# Main Navigation Flow (Active Features)

## Overview

This diagram shows the navigation structure for authenticated users across active features: Home tab (video content), Settings tab (profile management), and LogOut tab. Represents the current production user experience.

## Flow Diagram

```mermaid
flowchart TD
    Auth([Authenticated User]) --> TabBar[Bottom Tab Navigation]

    TabBar --> HomeTab[Home Tab]
    TabBar --> SettingsTab[Settings Tab]
    TabBar --> LogOutTab[LogOut Tab]

    subgraph Home["Home Tab (Active)"]
        HomeTab --> HomePage[HomePage]
        HomePage --> LoadContent{Content<br/>Loaded?}

        LoadContent -->|Loading| Spinner[Loading Spinner]
        LoadContent -->|Error| ErrorState[Error + Retry]
        LoadContent -->|Empty| EmptyState[No Content Message]
        LoadContent -->|Success| ContentDisplay[Content Display]

        ContentDisplay --> FeaturedVideo[Featured Video Hero]
        ContentDisplay --> NewEpisodes[New Episodes Carousel]
        ContentDisplay --> Popular[Popular Carousel]
        ContentDisplay --> Recommended[Recommended Carousel]

        FeaturedVideo --> VideoInteraction[Tap Video]
        NewEpisodes --> CardInteraction[Tap Content Card]
        Popular --> CardInteraction
        Recommended --> CardInteraction

        VideoInteraction -.->|Future| VideoPlayer[Video Player Screen]
        CardInteraction -.->|Future| ContentDetail[Content Detail Screen]

        ErrorState -->|Tap Retry| LoadContent
    end

    subgraph Settings["Settings Tab (Active)"]
        SettingsTab --> SettingsHub[Settings Hub]
        SettingsHub --> ProfilePic[Profile Picture Upload]
        SettingsHub --> PersonalNav[Tap 'Personal Info']
        SettingsHub --> BusinessNav[Tap 'Business Info']
        SettingsHub --> ArtNav[Tap 'Art Info']

        PersonalNav --> MyInfo[My Info Screen]
        BusinessNav --> Business[Business Screen]
        ArtNav --> Art[Art Screen]

        MyInfo --> MyInfoForm[Fill Personal Info]
        MyInfoForm --> MyInfoNext[Tap Next]
        MyInfoNext --> Business

        Business --> BusinessForm[Fill Business Info]
        BusinessForm --> BusinessNext[Tap Next]
        BusinessNext --> Art

        Art --> ArtForm[Fill Art Info]
        ArtForm --> ArtSave[Tap Save]
        ArtSave --> BackToHome[Navigate to HomePage]
    end

    subgraph LogOut["LogOut Tab (Active)"]
        LogOutTab --> LogOutScreen[LogOut Screen]
        LogOutScreen --> LogOutBtn[Tap Log Out Button]
        LogOutBtn --> DualLogout[Firebase + MongoDB Logout]
        DualLogout --> BackToSignIn[Navigate to Sign In]
    end

    BackToHome --> HomePage
    BackToSignIn -.-> SignIn[Sign In Screen]

    style HomePage fill:#9C27B0,color:#fff
    style SettingsHub fill:#4CAF50,color:#fff
    style LogOutScreen fill:#f44336,color:#fff
    style VideoPlayer stroke-dasharray: 5 5
    style ContentDetail stroke-dasharray: 5 5
```

## Tab Navigation Structure

### Home Tab (Purple)
**Purpose**: Main content consumption
**Key Screens**: HomePage
**User Goal**: Browse and watch video content

**Features**:
- Featured video hero section
- 3 content carousels (New, Popular, Recommended)
- Bunny CDN video streaming
- Loading/error states

### Settings Tab (Green)
**Purpose**: Profile management
**Key Screens**: Settings Hub, My Info, Business, Art
**User Goal**: Complete and update profile information

**Features**:
- Profile picture upload
- 3-step sequential form workflow
- Data persistence to MongoDB
- Validation and error handling

### LogOut Tab (Red)
**Purpose**: Session termination
**Key Screens**: LogOut Screen
**User Goal**: Sign out securely

**Features**:
- Dual authentication cleanup
- Secure token removal
- Auto-redirect to sign-in

## User Journeys

### Journey 1: Content Browsing
```
Auth → Home Tab → Browse Carousels → Select Video → (Future: Watch)
```
**Duration**: Ongoing browsing session
**Frequency**: Daily usage

### Journey 2: Profile Setup (First Time)
```
Auth → Settings Tab → Personal Info → Next → Business Info → Next → Art Info → Save → Home
```
**Duration**: 5-10 minutes
**Frequency**: Once (first-time setup) + occasional updates

### Journey 3: Profile Update (Returning)
```
Auth → Settings Tab → Select Specific Form → Update Fields → Save → Home
```
**Duration**: 1-2 minutes
**Frequency**: Occasional

### Journey 4: Session End
```
Any Screen → LogOut Tab → Tap Log Out → Sign In Screen
```
**Duration**: <10 seconds
**Frequency**: End of each session

## Navigation Patterns

### Tab Switching
- **Instant Access**: All tabs accessible from tab bar
- **State Preservation**: Tabs remain mounted (instant switching)
- **No Back Stack**: Tab switching doesn't add to navigation stack

### Stack Navigation (Settings)
- **Sequential Flow**: Personal → Business → Art
- **Back Button**: Available on each screen
- **Skip Ahead**: Can navigate directly to any form from hub

### Authentication Exit
- **LogOut**: Clears session, returns to sign-in
- **Root Layout Guard**: Prevents access to protected routes when logged out

## Screen Transitions

| From | To | Method | Animation |
|------|-----|--------|-----------|
| Any Tab | Another Tab | Tab press | Instant |
| Settings Hub | My Info | router.push() | Slide left |
| My Info | Business | router.push() | Slide left |
| Business | Art | router.push() | Slide left |
| Art | HomePage | router.push() | Replace |
| LogOut | Sign In | router.replace() | Replace |

## Content Interaction Points

### Home Tab Interactions
1. **Tap Featured Video** → Play video (future)
2. **Tap Content Card** → View details (future)
3. **Tap Card Menu** → Show options (share, save, report) (future)
4. **Swipe Carousel** → Browse more content
5. **Tap Retry** → Reload failed content

### Settings Tab Interactions
1. **Tap Profile Picture** → Upload new photo
2. **Tap Nav Button** → Open form
3. **Fill Form** → Input data
4. **Tap Next/Save** → Submit and navigate
5. **Tap Back** → Return to hub

### LogOut Tab Interactions
1. **Tap Log Out** → Confirm and sign out

## Hidden Features (Not in Current Flow)

The following tabs are implemented but hidden (`href: null`):
- **Social Tab** (5 screens) - Social networking features
- **Upload Tab** (1 screen) - Content upload
- **Shows Tab** (2 screens) - Premium show streaming

See [Future Features Flow](./future-features-flow.md) for details.

## Business Insights

### Active Features Adoption
- **Home Tab**: Primary engagement point
- **Settings Tab**: One-time setup + occasional updates
- **LogOut Tab**: Session management

### User Engagement Metrics
- **Home Tab Usage**: Daily active users, video views
- **Settings Completion**: % users who complete all 3 forms
- **Session Duration**: Time between login and logout

### Navigation Bottlenecks
- **Settings Forms**: Multi-step may have drop-off
- **Content Loading**: Errors may frustrate users
- **Video Playback**: Future feature needed for full value

## Related Documentation

- [HomePage Wireframe](../wireframes/02-home-tab/home-page.md)
- [Settings Hub Wireframe](../wireframes/03-settings-tab/settings-hub.md)
- [Settings Workflow Diagram](./settings-workflow.md)
- [LogOut Screen Wireframe](../wireframes/07-other/logout-screen.md)

---

*User journey documented as of 2026-01-30*
