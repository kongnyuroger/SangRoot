# Application Flow Diagram

## Overall User Journey Map

```
┌─────────────────────────────────────────────────────────────────┐
│                      APP LAUNCH                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                ┌──────────────────────────────┐
                │ Check Onboarding Status      │
                └──────────────────────────────┘
                    │                    │
         Not Done   │                    │ Done
                    ▼                    ▼
            ┌───────────────┐      ┌──────────────┐
            │ Onboarding 1  │      │ Login Screen │
            └───────────────┘      └──────────────┘
                    │
            ┌───────▼────────┐
            │ Onboarding 2   │
            └────────┬───────┘
                     │
            ┌────────▼────────┐
            │ Onboarding 3    │
            └────────┬───────┘
                     │
                     └──────────────────┐
                                        │
                                        ▼
                                   Login Screen
                                        │
                ┌───────────────────────┼───────────────────────┐
                │                       │                       │
                ▼                       ▼                       ▼
         ┌─────────────┐         ┌──────────────┐        ┌──────────────┐
         │Register New │         │   Login      │        │Accept Invite │
         │  Account    │         │   (Existing) │        │   (Doctor)   │
         └─────────────┘         └──────────────┘        └──────────────┘
                │                       │                       │
                ▼                       ▼                       ▼
         ┌─────────────────────────────────────────────────────────────┐
         │            API: POST /auth/{register|login|accept-invite}   │
         └─────────────────────────────────────────────────────────────┘
                │                       │                       │
                ▼                       ▼                       ▼
         ┌──────────────┐         ┌──────────────┐        ┌──────────┐
         │Complete      │         │Decode JWT    │        │Store     │
         │Profile Form  │         │for Role      │        │Tokens    │
         └──────────────┘         └──────────────┘        └──────────┘
                │                       │                       │
                ▼                       ▼                       ▼
         ┌──────────────┐         ┌──────────────┐        ┌──────────┐
         │POST Profile  │         │Route Based   │        │Navigate  │
         │to /hospitals/│         │on Role:      │        │to Doctor │
         │or /blood-    │         │- DOCTOR      │        │Dashboard │
         │banks/profile │         │- HOSPITAL    │        └──────────┘
         └──────────────┘         │- BLOOD_BANK  │
                │                 └──────────────┘
                │                       │
                ▼                       ▼
         ┌──────────────────────────────────────┐
         │  Navigate to Dashboard               │
         │  Based on Role                       │
         └──────────────────────────────────────┘
                │                       │
    ┌───────────┼───────────┬──────────────────┐
    │           │           │                  │
    ▼           ▼           ▼                  ▼
┌─────────┐ ┌─────────┐ ┌─────────┐      ┌─────────┐
│Hospital │ │Blood Bank│ │Doctor   │      │Unknown  │
│Admin    │ │Admin     │ │Dashboard│      │(Fallback)
│Dash     │ │Dash      │ │         │      │to Home  │
└─────────┘ └─────────┘ └─────────┘      └─────────┘
```

## Detailed Registration Flow

```
┌─────────────────────────────────────────────────┐
│         REGISTRATION FLOW                        │
└─────────────────────────────────────────────────┘

      Register Screen
      ├─ Role Selection
      │  └─ DOCTOR / HOSPITAL / BLOOD_BANK (Required)
      ├─ Email (Required)
      └─ Password (Required)
             │
             ▼
      ┌─────────────────────────────────────────┐
      │ POST /auth/register                     │
      │ {                                       │
      │   email,                                │
      │   password,                             │
      │   role                                  │
      │ }                                       │
      └─────────────────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
   Success       Error
      │             │
      │             └─→ Alert & Stay
      │
      ▼
Complete Profile Screen
(Hospital/Blood Bank Only)
├─ Organization Name (Required)
├─ Address (Required)
├─ City (Required)
├─ State
├─ Pincode
├─ Phone (Required)
├─ License Number
└─ [Latitude, Longitude - Reserved]
       │
       ▼
┌──────────────────────────────────────────────┐
│ HOSPITAL Role:                               │
│ POST /hospitals/profile                      │
│                                              │
│ BLOOD_BANK Role:                             │
│ POST /blood-banks/profile                    │
│                                              │
│ {                                            │
│   name,                                      │
│   address,                                   │
│   city,                                      │
│   state,                                     │
│   pincode,                                   │
│   phone,                                     │
│   latitude,                                  │
│   longitude,                                 │
│   licenseNumber                              │
│ }                                            │
└──────────────────────────────────────────────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
Success Error
   │       │
   │       └─→ Alert & Stay
   │
   ▼
Navigate to Dashboard
├─ HOSPITAL → /(hospital-admin)
└─ BLOOD_BANK → /(blood-bank-admin)
```

## Doctor Invite Flow

```
┌─────────────────────────────────────────────┐
│         DOCTOR INVITE FLOW                   │
└─────────────────────────────────────────────┘

   Accept Invite Screen
   ├─ Full Name (Required)
   ├─ Email (Required)
   ├─ Password ≥8 chars (Required)
   ├─ Phone Number (Required)
   ├─ Medical Registration (Required)
   ├─ Specialization (Required)
   └─ Invite ID (From URL/Form)
       │
       ▼
┌──────────────────────────────────────────────┐
│ POST /auth/accept-invite                     │
│ {                                            │
│   inviteId,                                  │
│   name,                                      │
│   email,                                     │
│   password,                                  │
│   phone,                                     │
│   registrationNo,                            │
│   specialization                             │
│ }                                            │
└──────────────────────────────────────────────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
Success Error
   │       │
   │       └─→ Alert & Stay
   │
   ▼
Store Tokens
├─ Access Token → SecureStore
└─ Refresh Token → SecureStore
       │
       ▼
Navigate to /(doctor) Dashboard
```

## Login Flow with Role-Based Navigation

```
┌─────────────────────────────────────┐
│      LOGIN FLOW                      │
└─────────────────────────────────────┘

   Login Screen
   ├─ Email (Required)
   └─ Password (Required)
       │
       ▼
┌──────────────────────────────┐
│ POST /auth/login             │
│ {                            │
│   email,                     │
│   password                   │
│ }                            │
└──────────────────────────────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
Success Error
   │       │
   │       └─→ Alert & Stay
   │
   ▼
Store Tokens
├─ Access Token → SecureStore
└─ Refresh Token → SecureStore
       │
       ▼
Get Access Token
       │
       ▼
Decode JWT Payload
       │
       ▼
Extract Role
       │
   ┌───┴──────┬──────────┬──────────┐
   │          │          │          │
   ▼          ▼          ▼          ▼
DOCTOR    HOSPITAL  BLOOD_BANK   OTHER
   │          │          │          │
   ▼          ▼          ▼          ▼
/(doctor) /(hospital-  /(blood-  /(home)
          admin)      bank-admin)
```

## State Management Flow

```
┌────────────────────────────────────────────────┐
│         STORAGE STRUCTURE                       │
└────────────────────────────────────────────────┘

AsyncStorage (Plain)
├─ onboarding_completed: "true" | undefined
└─ [Other app settings]

SecureStore (Encrypted)
├─ access_token: "eyJhbG..." (JWT)
├─ refresh_token: "eyJhbG..."
└─ [Other sensitive data]
```

## JWT Token Structure

```
┌──────────────────────────────────────────────┐
│         JWT TOKEN                             │
└──────────────────────────────────────────────┘

Header.Payload.Signature

Payload Example:
{
  "sub": "989afc6c-1d23-4d78-b999-21bc09fe4b48",  // User ID
  "role": "HOSPITAL",                              // User Role
  "email": "hospital3@example.com",               // Email
  "iat": 1770468582,                              // Issued At
  "exp": 1770469482                               // Expiration
}

Extracted using:
- decodeToken(token) → Full payload
- getTokenRole(token) → "DOCTOR" | "HOSPITAL" | "BLOOD_BANK"
- getTokenEmail(token) → Email string
- getTokenUserId(token) → User ID
- isTokenExpired(token) → Boolean
```

## Component Hierarchy

```
Root Layout
├─ Stack Navigator
│  ├─ (auth)
│  │  ├─ onboarding-1
│  │  ├─ onboarding-2
│  │  ├─ onboarding-3
│  │  ├─ login
│  │  ├─ register
│  │  ├─ complete-profile
│  │  └─ accept-invite
│  │
│  ├─ (doctor)
│  │  ├─ _layout
│  │  ├─ history
│  │  ├─ request
│  │  └─ settings
│  │
│  ├─ (hospital-admin)
│  │  ├─ _layout
│  │  ├─ activity
│  │  ├─ register-donor
│  │  ├─ invite-doctors
│  │  ├─ request
│  │  └─ settings
│  │
│  └─ (blood-bank-admin)
│     ├─ _layout
│     ├─ activity
│     ├─ register-donor
│     ├─ settings
│     └─ [other screens]
```

## Error Flow

```
┌──────────────────────────────────┐
│       ERROR HANDLING              │
└──────────────────────────────────┘

API Call
   │
   ├─ Network Error
   │  └─→ Alert: "Failed to complete profile"
   │
   ├─ Validation Error
   │  └─→ Alert with server message
   │
   ├─ 4xx Client Error
   │  └─→ Alert with error details
   │
   └─ 5xx Server Error
      └─→ Alert: "Server error, please try again"

User Response:
├─ Retry: Clear error & try again
├─ Go Back: Navigate to previous screen
└─ Contact Support: [Future feature]
```
