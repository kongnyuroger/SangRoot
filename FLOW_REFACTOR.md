# SangRoot Application Flow Refactor

## Overview

The application has been refactored to include a comprehensive onboarding experience followed by flexible login/registration options.

## New Application Flow

### 1. **First-Time User Journey**

When a user opens the app for the first time:

- **Onboarding Screen 1** (`/app/(auth)/onboarding-1.tsx`)
  - Welcome message and introduction to SangRoot
  - "Next" button → Onboarding Screen 2

- **Onboarding Screen 2** (`/app/(auth)/onboarding-2.tsx`)
  - Features overview (Managing blood requests)
  - "Next" button → Onboarding Screen 3
  - "Back" button → Onboarding Screen 1

- **Onboarding Screen 3** (`/app/(auth)/onboarding-3.tsx`)
  - Call-to-action with platform benefits
  - "Get Started" button → Login Screen
  - Marks onboarding as completed in AsyncStorage
  - "Back" button → Onboarding Screen 2

### 2. **Login Flow**

**Login Screen** (`/app/(auth)/login.tsx`)

- Email and password input fields
- Login button → Authenticates and navigates to dashboard
- "Create Account" button → Registration Screen
- "Accept Invite" button → Accept Invite Screen

### 3. **Registration Flow**

**Registration Screen** (`/app/(auth)/register.tsx`)

- **Role Selection** (mandatory):
  - DOCTOR: Register as a healthcare professional
  - HOSPITAL: Register as a hospital administrator
  - BLOOD_BANK: Register as a blood bank administrator
- Email and password input
- Register button → Calls `/auth/register` endpoint with email, password, and role
- Navigates to Complete Profile screen on success
- "Back to Login" button

### 4. **Accept Invite Flow**

**Accept Invite Screen** (`/app/(auth)/accept-invite.tsx`)

- Invite code input
- Email input
- Password creation input
- Accept Invite button → Processes invite acceptance
- "Back to Login" button

## File Structure

```
app/(auth)/
├── _layout.tsx                 # Auth layout wrapper
├── onboarding-1.tsx            # First onboarding screen
├── onboarding-2.tsx            # Second onboarding screen
├── onboarding-3.tsx            # Third onboarding screen (marks completion)
├── login.tsx                   # Main login screen (new)
├── register.tsx                # Registration with role selection (updated)
├── accept-invite.tsx           # Accept invite flow (new)
├── doctor-login.tsx            # [Deprecated] Old login screen
├── hospital-admin-login.tsx    # [Deprecated]
├── blood-bank-admin-login.tsx  # [Deprecated]
├── complete-profile.tsx        # [Existing] Post-registration
```

## Key Components

### AuthStorage Enhancements (`src/lib/authStorage.ts`)

New functions added:

- `hasCompletedOnboarding()` - Check if user completed onboarding
- `setOnboardingCompleted()` - Mark onboarding as done
- `resetOnboarding()` - Reset onboarding state (for dev/testing)

### Home Screen (`app/index.tsx`)

- Checks onboarding completion on app load
- Redirects to onboarding-1 if not completed
- Shows navigation buttons after onboarding

## API Endpoints Used

### Registration Endpoint

```
POST /auth/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "DOCTOR" | "HOSPITAL" | "BLOOD_BANK"
}
```

Response:

```json
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### Login Endpoint

```
POST /auth/login
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Accept Invite Endpoint

```
TODO: Implement based on your backend specification
POST /auth/accept-invite
{
  "inviteCode": "code123",
  "email": "user@example.com",
  "password": "securePassword123"
}
```

## Navigation Flow Diagram

```
App Launch
    ↓
Has Completed Onboarding?
    ├─ No → Onboarding 1 → Onboarding 2 → Onboarding 3
    │                                         ↓
    │                                    Login Screen ←──────┐
    │                                      ├─ Login          │
    │                                      ├─ Register ─────→ Select Role → Fill Details → Complete
    │                                      └─ Accept Invite → Fill Details
    │
    └─ Yes → Login Screen (from index.tsx)
```

## Implementation Notes

1. **Onboarding State**: Uses `AsyncStorage` via `onboarding_completed` key
2. **Authentication**: Still uses SecureStore for tokens (unchanged)
3. **Role Selection**: Mandatory in registration flow
4. **Navigation**: Uses Expo Router's stack-based navigation
5. **Styling**: Basic React Native styles (can be enhanced with NativeWind/Tailwind)

## Testing the Flow

### First-Time User:

1. Clear app data/reinstall
2. App → Onboarding 1 → Onboarding 2 → Onboarding 3 → Login
3. Click "Create Account" → Select Role → Register

### Returning User:

1. App loads → Login Screen directly

### Reset Onboarding (Development):

```typescript
import { resetOnboarding } from "./src/lib/authStorage";

// In a component:
const handleResetOnboarding = async () => {
  await resetOnboarding();
  router.push("/(auth)/onboarding-1");
};
```

## Next Steps

1. **Connect Accept Invite Endpoint**: Implement the backend API call in accept-invite.tsx
2. **UI Polish**: Add animations, better styling with Tailwind/NativeWind
3. **Validation**: Add email/password validation and error messages
4. **Accessibility**: Add proper labels and accessibility hints
5. **Loading States**: Enhance loading indicators during API calls
