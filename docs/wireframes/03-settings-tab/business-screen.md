# Business Screen

**Path:** `app/(tabs)/(settings)/BusinessScreen.tsx`
**Route:** `/(tabs)/(settings)/BusinessScreen`
**Status:** Active
**Parent Layout:** Settings Tab Stack Navigator

## Overview

The Business Screen is a conditional questionnaire that collects business-related information from entrepreneurs. Features a yes/no picker for entrepreneur status, followed by conditional fields for company info, industry, business objectives, and metrics if user is an entrepreneur.

## Component Hierarchy

```mermaid
graph TD
    A[KeyboardAvoidingView] --> B[ScrollView]
    B --> C[Form Container]

    C --> D[Back Button]
    C --> E[Title Section]
    C --> F[Entrepreneur Picker]
    C --> G[Conditional Fields]
    C --> H[Submit Button]

    F --> F1[Picker: Yes/No]

    G -->|If Yes| G1[Company Name Input]
    G -->|If Yes| G2[Industry Input]
    G -->|If Yes| G3[Objectives Input]
    G -->|If Yes| G4[Years in Business Input]
    G -->|If Yes| G5[Employee Count Input]

    H --> H1[Next Button]
```

## UI Layout

```mermaid
flowchart TD
    Screen[Business Screen] --> Header[Header]
    Screen --> Body[Form Body]
    Screen --> Footer[Actions]

    Header --> BackBtn[← Back]
    Header --> Title[Business Information]

    Body --> Question[Are you an entrepreneur?]
    Question --> YesNo[Yes/No Picker]

    YesNo --> Conditional{If Yes}

    Conditional -->|Yes| BusinessFields[Business Fields]
    Conditional -->|No| Skip[Skip to Next Button]

    BusinessFields --> CompanyName[Company Name]
    BusinessFields --> Industry[Industry]
    BusinessFields --> Objectives[Business Objectives]
    BusinessFields --> Years[Years in Business]
    BusinessFields --> Employees[Number of Employees]

    Footer --> NextBtn[Next Button →]
```

## Fields & Validation

| Field | Condition | Type | Validation |
|-------|-----------|------|------------|
| Entrepreneur? | Always | Picker (Yes/No) | Required |
| Company Name | If Yes | TextInput | Required if entrepreneur |
| Industry | If Yes | TextInput | Required if entrepreneur |
| Objectives | If Yes | TextInput (multiline) | Optional |
| Years in Business | If Yes | Number Input | Optional |
| Employee Count | If Yes | Number Input | Optional |

## State Management

```typescript
// Main field
- isEntrepreneur: string ("Yes" | "No" | "")
- showEntrepreneurPicker: boolean

// Conditional fields (only if entrepreneur)
- companyName: string
- industry: string
- objectives: string
- yearsInBusiness: string
- employeeCount: string

// UI state
- loading: boolean
- errors: Record<string, string>
```

## Conditional Logic

```mermaid
stateDiagram-v2
    [*] --> QuestionDisplayed
    QuestionDisplayed --> EntrepreneurYes: User selects Yes
    QuestionDisplayed --> EntrepreneurNo: User selects No

    EntrepreneurYes --> ShowBusinessFields
    EntrepreneurNo --> HideBusinessFields

    ShowBusinessFields --> ValidateBusinessFields: User taps Next
    ValidateBusinessFields --> SaveAndNavigate: Valid
    ValidateBusinessFields --> ShowErrors: Invalid

    HideBusinessFields --> SaveAndNavigate: User taps Next

    ShowErrors --> ShowBusinessFields
    SaveAndNavigate --> [*]
```

## Form Submission Flow

```mermaid
sequenceDiagram
    User->>Form: Select entrepreneur status
    alt User selects "Yes"
        Form->>Form: Show business fields
        User->>Form: Fill business fields
    else User selects "No"
        Form->>Form: Hide business fields
    end

    User->>Form: Tap Next
    Form->>Form: Validate required fields
    alt Validation Failed
        Form->>User: Show errors
    else Validation Passed
        Form->>API: Save business info
        alt API Success
            API->>Form: Success
            Form->>User: Navigate to ArtScreen
        else API Failed
            API->>Form: Error
            Form->>User: Show error alert
        end
    end
```

## Visual Design

- **Picker Section**: Centered picker for entrepreneur question
- **Conditional Fields**: Slide in/fade in when "Yes" selected
- **Text Areas**: Multiline input for objectives
- **Number Inputs**: Numeric keyboard for years/employees
- **Theme Support**: Dark/light mode compatible

## Implementation Notes

**File Reference**: [app/(tabs)/(settings)/BusinessScreen.tsx](../../../app/(tabs)/(settings)/BusinessScreen.tsx)

**Key Dependencies**:
- Picker (@react-native-picker/picker)
- userProfileService.updateBusiness()
- useUserProfile hook

**Conditional Rendering**:
```typescript
{isEntrepreneur === "Yes" && (
  <View>
    {/* Business fields */}
  </View>
)}
```

**Data Persistence**: Saves to MongoDB `profile.business` collection

**Navigation**: `router.push("/(tabs)/(settings)/ArtScreen")` on success

## Related Screens

- **Previous**: [My Info Screen](./my-info-screen.md)
- **Next**: [Art Screen](./art-screen.md)

---

*Wireframe as of 2026-01-30*
