# My Info Screen

**Path:** `app/(tabs)/(settings)/MyInfoScreen.tsx`
**Route:** `/(tabs)/(settings)/MyInfoScreen`
**Status:** Active
**Parent Layout:** Settings Tab Stack Navigator

## Overview

The My Info Screen is a comprehensive form for collecting personal information and preferences. It includes fields for name, date of birth, location, and user preferences (likes, comments, shares). Features validation, profile picture upload, and navigates to Business Screen upon completion.

## Component Hierarchy

```mermaid
graph TD
    A[KeyboardAvoidingView] --> B[ScrollView]
    B --> C[Form Container]

    C --> D[Back Button]
    C --> E[Profile Section]
    C --> F[Name Fields]
    C --> G[DOB Field]
    C --> H[Location Fields]
    C --> I[Preferences Section]
    C --> J[Submit Button]

    E --> E1[ProfilePicture Component]
    F --> F1[First Name Input]
    F --> F2[Last Name Input]
    G --> G1[Date Picker]
    H --> H1[City Input]
    H --> H2[State Input]
    H --> H3[Country Input]
    I --> I1[Likes Toggle]
    I --> I2[Comments Toggle]
    I --> I3[Shares Toggle]
    J --> J1[Next Button]
```

## UI Layout

```mermaid
flowchart TD
    Screen[My Info Screen] --> Header[Header]
    Screen --> Body[Form Body]
    Screen --> Footer[Actions]

    Header --> BackBtn[← Back]
    Header --> Title[My Information]

    Body --> Profile[Profile Picture Upload]
    Body --> BasicInfo[Basic Information]
    Body --> LocationInfo[Location]
    Body --> PrefsInfo[Preferences]

    BasicInfo --> FirstName[First Name]
    BasicInfo --> LastName[Last Name]
    BasicInfo --> DOB[Date of Birth Picker]

    LocationInfo --> City[City]
    LocationInfo --> State[State]
    LocationInfo --> Country[Country]

    PrefsInfo --> Likes[Enable Likes Switch]
    PrefsInfo --> Comments[Enable Comments Switch]
    PrefsInfo --> Shares[Enable Shares Switch]

    Footer --> NextBtn[Next Button →]
```

## Fields & Validation

| Field | Type | Validation | Error Message |
|-------|------|------------|---------------|
| Profile Picture | Image | Optional | - |
| First Name | TextInput | Required, not empty | "First name is required" |
| Last Name | TextInput | Required, not empty | "Last name is required" |
| Date of Birth | DatePicker | Required, Millennials 1981-1997 | "Must be Millennial (1981-1997)" |
| City | TextInput | Optional | - |
| State | TextInput | Optional | - |
| Country | TextInput | Optional | - |
| Likes | Switch | Boolean (default: true) | - |
| Comments | Switch | Boolean (default: true) | - |
| Shares | Switch | Boolean (default: true) | - |

## State Management

```typescript
// Form fields
- firstName: string
- lastName: string
- dateOfBirth: Date
- city: string
- state: string
- country: string
- likesEnabled: boolean
- commentsEnabled: boolean
- sharesEnabled: boolean

// UI state
- loading: boolean
- errors: Record<string, string>
- showDatePicker: boolean
```

## User Interactions

| Element | Action | Target |
|---------|--------|--------|
| Profile Picture | Tap | Image picker modal |
| Date Picker | Tap | Open native date picker |
| Switches | Toggle | Update boolean state |
| Next Button | Submit | Validate → Navigate to BusinessScreen |

## Form Submission Flow

```mermaid
sequenceDiagram
    User->>Form: Fill fields
    User->>Form: Tap Next
    Form->>Form: Validate all fields
    alt Validation Failed
        Form->>User: Show errors
    else Validation Passed
        Form->>API: Save personal info
        alt API Success
            API->>Form: Success response
            Form->>User: Navigate to BusinessScreen
        else API Failed
            API->>Form: Error
            Form->>User: Show error alert
        end
    end
```

## Visual Design

- **Profile Section**: Centered profile picture at top
- **Form Groups**: Sections separated visually
- **Input Styling**: Consistent with globalStyles
- **Switches**: iOS/Android native switches with labels
- **Colors**: Theme-aware (dark/light mode)

## Implementation Notes

**File Reference**: [app/(tabs)/(settings)/MyInfoScreen.tsx](../../../app/(tabs)/(settings)/MyInfoScreen.tsx)

**Key Dependencies**:
- ProfilePicture component
- DateTimePicker
- userProfileService.updatePersonalInfo()
- useUserProfile hook

**Data Persistence**: Saves to MongoDB via userProfileService

**Navigation**: `router.push("/(tabs)/(settings)/BusinessScreen")` on success

## Related Screens

- **Previous**: [Settings Hub](./settings-hub.md)
- **Next**: [Business Screen](./business-screen.md)

---

*Wireframe as of 2026-01-30*
