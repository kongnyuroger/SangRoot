# Updated Application Flow - Registration & Profile Completion

## Overview

This document outlines the updated registration, profile completion, and invite acceptance flows with proper API integration and role-based navigation.

---

## 1. Registration Flow

### Screen: `app/(auth)/register.tsx`

User selects their role and provides basic credentials.

#### Fields:

- **Role Selection** (Required)
  - DOCTOR - Healthcare professional
  - HOSPITAL - Hospital administrator
  - BLOOD_BANK - Blood bank administrator

- **Email** (Required) - User's email address
- **Password** (Required) - Account password

#### API Call:

```
POST http://localhost:3000/auth/register
```

**Request:**

```json
{
  "email": "hospital3@example.com",
  "password": "securepassword1234",
  "role": "HOSPITAL"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "989afc6c-1d23-4d78-b999-21bc09fe4b48",
    "email": "hospital3@example.com",
    "role": "HOSPITAL"
  }
}
```

#### Navigation:

- ✅ **Success** → Navigate to `/(auth)/complete-profile` with role parameter
- ❌ **Error** → Show Alert with error message

---

## 2. Profile Completion Flow

### Screen: `app/(auth)/complete-profile.tsx`

Users complete their organization/profile information based on their role.

#### For HOSPITAL & BLOOD_BANK:

##### Fields:

- **Name** (Required) - Organization name
- **Address** (Required) - Street address
- **City** (Required) - City name
- **State** (Optional) - State/Province
- **Pincode** (Optional) - Postal code
- **Phone** (Required) - Contact phone number
- **License Number** (Optional) - Government license
- **Latitude** (Optional) - GPS latitude (future use)
- **Longitude** (Optional) - GPS longitude (future use)

##### API Call for Hospital:

```
POST http://localhost:3000/hospitals/profile
Headers: Authorization: Bearer {accessToken}
```

**Request:**

```json
{
  "name": "General Hospital",
  "address": "121 Main Street",
  "city": "Yaounde",
  "state": "Centre",
  "pincode": "00000",
  "phone": "2343423443",
  "latitude": null,
  "longitude": null,
  "licenseNumber": "LIC-12345"
}
```

##### API Call for Blood Bank:

```
POST http://localhost:3000/blood-banks/profile
Headers: Authorization: Bearer {accessToken}
```

**Request:**

```json
{
  "name": "CNTS Blood Bank",
  "address": "121 Health Street",
  "city": "Yaounde",
  "state": "Centre",
  "pincode": "00000",
  "phone": "2343423443",
  "latitude": null,
  "longitude": null,
  "licenseNumber": "LIC-BB-456"
}
```

#### Navigation:

- ✅ **Success** →
  - If HOSPITAL → `/(hospital-admin)`
  - If BLOOD_BANK → `/(blood-bank-admin)`
- ❌ **Error** → Show Alert with error message

---

## 3. Doctor Invite Acceptance Flow

### Screen: `app/(auth)/accept-invite.tsx`

Doctors register using an invite code.

#### Fields:

- **Invite ID** (Required) - Sent via URL parameter or form
- **Full Name** (Required) - Doctor's full name
- **Email** (Required) - Doctor's email
- **Password** (Required) - Minimum 8 characters
- **Phone** (Required) - Contact number
- **Medical Registration Number** (Required) - Government registration number
- **Specialization** (Required) - Medical specialty (e.g., "Cardiology", "General Practice")

#### API Call:

```
POST http://localhost:3000/auth/accept-invite
```

**Request:**

```json
{
  "inviteId": "31a9f23f-ebd9-41f9-982f-eeb79b04e247",
  "name": "DR Roger",
  "email": "ruger1234@gmail.com",
  "password": "12345678",
  "phone": "12345",
  "registrationNo": "123444",
  "specialization": "Cardiology"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "00449a8a-b596-413a-bbb2-ec63e731ae63",
    "email": "ruger1234@gmail.com",
    "role": "DOCTOR"
  }
}
```

#### Navigation:

- ✅ **Success** → `/(doctor)` dashboard
- ❌ **Error** → Show Alert with error message

---

## 4. Login Flow (Updated)

### Screen: `app/(auth)/login.tsx`

User logs in with email and password. Navigation is role-based after successful login.

#### API Call:

```
POST http://localhost:3000/auth/login
```

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "optional_refresh_token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "DOCTOR"
  }
}
```

#### Navigation (Role-Based):

- **DOCTOR** → `/(doctor)` dashboard
- **HOSPITAL** → `/(hospital-admin)` dashboard
- **BLOOD_BANK** → `/(blood-bank-admin)` dashboard
- **Unknown Role** → `/` (home)

---

## Complete Flow Diagrams

### Hospital/Blood Bank Registration Flow:

```
Register (select role + email/password)
    ↓
Send to /auth/register
    ↓
Complete Profile (name, address, city, phone, license)
    ↓
Send to /hospitals/profile or /blood-banks/profile
    ↓
Navigate to respective dashboard
```

### Doctor Invite Flow:

```
Accept Invite (name, email, password, phone, registration, specialization)
    ↓
Send to /auth/accept-invite
    ↓
Navigate to /(doctor) dashboard
```

### Login Flow:

```
Login (email + password)
    ↓
Send to /auth/login
    ↓
Decode JWT to get role
    ↓
Navigate based on role to appropriate dashboard
```

---

## Key Components & Utilities

### 1. Token Utilities (`src/lib/tokenUtils.ts`)

Provides JWT token manipulation functions:

```typescript
import {
  decodeToken,
  getTokenRole,
  getTokenEmail,
  getTokenUserId,
  isTokenExpired,
} from "@/lib/tokenUtils";

// Decode a token
const decoded = decodeToken(token);

// Get role from token
const role = getTokenRole(token); // Returns "DOCTOR", "HOSPITAL", or "BLOOD_BANK"

// Check if token is expired
if (isTokenExpired(token)) {
  // Token needs refresh
}
```

### 2. Auth Storage (`src/lib/authStorage.ts`)

Enhanced with onboarding state management:

```typescript
import {
  getAccessToken,
  setAccessToken,
  hasCompletedOnboarding,
  setOnboardingCompleted,
  resetOnboarding,
} from "@/lib/authStorage";
```

### 3. Auth Hooks (`src/hooks/useAuthHooks.ts`)

- `useLogin()` - Login mutation with query invalidation
- `useRegister()` - Register mutation with role support
- `useProfile()` - Get user profile
- `useUpdateProfile()` - Update profile

---

## Error Handling

All screens include:

1. **Required Field Validation** - Alert if required fields are empty
2. **API Error Handling** - Display server error messages
3. **Network Error Handling** - Try-catch blocks with user-friendly messages
4. **Loading States** - Disabled buttons during API calls with "Loading..." text

---

## Security Considerations

1. **JWT Tokens**
   - Stored in SecureStore (encrypted)
   - Decoded locally using utility functions
   - Role-based navigation happens after token decoding

2. **Password Requirements**
   - Minimum 8 characters (enforced on accept-invite)
   - SecureTextEntry on password fields

3. **Authorization Headers**
   - All API calls include `Authorization: Bearer {token}` header
   - Refresh token mechanism in place (see `refreshToken()` in auth.service.ts)

---

## Testing Checklist

### Hospital Registration:

- [ ] Register with HOSPITAL role
- [ ] Fill profile with required fields
- [ ] Verify POST to `/hospitals/profile` succeeds
- [ ] Redirects to `/(hospital-admin)`

### Blood Bank Registration:

- [ ] Register with BLOOD_BANK role
- [ ] Fill profile with required fields
- [ ] Verify POST to `/blood-banks/profile` succeeds
- [ ] Redirects to `/(blood-bank-admin)`

### Doctor Invite:

- [ ] Accept invite with all required fields
- [ ] Password minimum 8 characters enforced
- [ ] Verify POST to `/auth/accept-invite` succeeds
- [ ] Redirects to `/(doctor)`

### Login Navigation:

- [ ] Doctor login → `/(doctor)` dashboard
- [ ] Hospital login → `/(hospital-admin)` dashboard
- [ ] Blood bank login → `/(blood-bank-admin)` dashboard

---

## Future Enhancements

1. **Image Upload** - Profile photo/logo upload
2. **Geolocation** - Auto-fill latitude/longitude
3. **Phone Verification** - OTP verification for phone numbers
4. **Email Verification** - Confirm email before account activation
5. **Profile Editing** - Allow users to update profile information later
6. **Document Upload** - Upload government licenses/certifications
