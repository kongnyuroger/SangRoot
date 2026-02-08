# Implementation Checklist & Testing Guide

## ✅ Completed Tasks

### Core Screens

- [x] Onboarding Screen 1 - Welcome & Introduction
- [x] Onboarding Screen 2 - Features Overview
- [x] Onboarding Screen 3 - Call-to-action with onboarding completion
- [x] Login Screen - With email/password and role-based navigation
- [x] Register Screen - With role selection
- [x] Complete Profile Screen - Role-specific forms for hospital/blood bank
- [x] Accept Invite Screen - Doctor registration with detailed form

### Core Features

- [x] First-time user onboarding detection
- [x] Role-based registration
- [x] Role-based profile completion
- [x] Role-based login navigation
- [x] JWT token decoding utilities
- [x] Onboarding state management
- [x] Error handling with user-friendly alerts
- [x] Loading states during API calls
- [x] Form validation

### Utilities & Services

- [x] Token utilities (tokenUtils.ts) for JWT handling
- [x] Enhanced auth storage with onboarding functions
- [x] Auth service with register endpoint support
- [x] Auth hooks with role parameter support

### Documentation

- [x] FLOW_REFACTOR.md - Overall app flow
- [x] REGISTRATION_FLOW.md - Detailed registration/profile flows
- [x] IMPLEMENTATION_SUMMARY.md - Summary of changes
- [x] FLOW_DIAGRAMS.md - Visual diagrams
- [x] API_REFERENCE.md - API documentation
- [x] TESTING_CHECKLIST.md - Testing guide

---

## 🧪 Testing Checklist

### Pre-Testing Setup

- [ ] Ensure backend server is running on `http://localhost:3000`
- [ ] Verify all database tables are created
- [ ] Clear app cache/reinstall for clean testing

### 1. Onboarding Flow Testing

#### Onboarding Screens

- [ ] First launch shows onboarding screen 1
- [ ] Onboarding 1 → Click "Next" → Navigate to onboarding 2
- [ ] Onboarding 2 → Click "Back" → Navigate to onboarding 1
- [ ] Onboarding 2 → Click "Next" → Navigate to onboarding 3
- [ ] Onboarding 3 → Click "Back" → Navigate to onboarding 2
- [ ] Onboarding 3 → Click "Get Started" → Navigate to login
- [ ] Verify `onboarding_completed` is set to true in AsyncStorage
- [ ] Subsequent app launches skip onboarding and go to login

### 2. Hospital Registration Testing

#### Registration Screen

- [ ] Click "Create Account" from login screen
- [ ] Registration screen displays
- [ ] Role selection required (cannot proceed without selecting)
- [ ] Select "HOSPITAL" role
- [ ] Enter valid email
- [ ] Enter valid password
- [ ] Click "Register"

#### API Call

- [ ] Backend receives POST to `/auth/register`
- [ ] Request includes: email, password, role="HOSPITAL"
- [ ] Response returns: accessToken, refreshToken, user object
- [ ] Tokens are stored in SecureStore
- [ ] Navigate to complete-profile with role="HOSPITAL" parameter

#### Profile Completion Screen

- [ ] Screen shows "Hospital Profile" title
- [ ] All fields are present:
  - [ ] Hospital Name (labeled "Hospital Name")
  - [ ] Address
  - [ ] City
  - [ ] State
  - [ ] Pincode
  - [ ] Phone
  - [ ] License Number
- [ ] Validate required fields (name, address, city, phone)
- [ ] Fill in all required fields with valid data
- [ ] Click "Complete Profile"

#### Profile API Call

- [ ] Backend receives POST to `/hospitals/profile`
- [ ] Request includes Authorization header with Bearer token
- [ ] Request body includes all form fields
- [ ] Response is successful (200/201)
- [ ] Navigate to `/(hospital-admin)` dashboard
- [ ] Alert shows "Profile completed successfully!"

### 3. Blood Bank Registration Testing

#### Registration & Profile (Same as Hospital)

- [ ] Select "BLOOD_BANK" role
- [ ] Complete registration flow
- [ ] Complete profile screen shows "Blood Bank Profile" title
- [ ] Profile endpoint is `/blood-banks/profile` (not `/hospitals/profile`)
- [ ] Navigate to `/(blood-bank-admin)` dashboard

### 4. Doctor Invite Testing

#### Accept Invite Screen

- [ ] Click "Accept Invite" from login screen
- [ ] All fields are present:
  - [ ] Full Name
  - [ ] Email
  - [ ] Password (with ≥8 chars requirement)
  - [ ] Phone Number
  - [ ] Medical Registration Number
  - [ ] Specialization
- [ ] Fill in all fields with valid data
- [ ] Password less than 8 chars → Show error
- [ ] Missing required fields → Show error
- [ ] Click "Accept Invite & Register"

#### Invite API Call

- [ ] Backend receives POST to `/auth/accept-invite`
- [ ] Request includes: inviteId, name, email, password, phone, registrationNo, specialization
- [ ] Response returns: accessToken, refreshToken, user with role="DOCTOR"
- [ ] Tokens are stored in SecureStore
- [ ] Navigate to `/(doctor)` dashboard
- [ ] Alert shows "Account created successfully! Logging you in..."

### 5. Login Testing

#### Login Screen

- [ ] Click "Login as Doctor" from index/home screen
- [ ] Navigate to login screen
- [ ] Enter valid email and password
- [ ] Click "Login" button

#### Doctor Login

- [ ] API call to `/auth/login` succeeds
- [ ] Token is decoded
- [ ] Role is extracted as "DOCTOR"
- [ ] Navigate to `/(doctor)` dashboard

#### Hospital Admin Login

- [ ] Create hospital account and complete profile
- [ ] Logout (clear tokens)
- [ ] Go back to login
- [ ] Enter hospital email and password
- [ ] API succeeds with role="HOSPITAL"
- [ ] Navigate to `/(hospital-admin)` dashboard

#### Blood Bank Admin Login

- [ ] Create blood bank account and complete profile
- [ ] Logout (clear tokens)
- [ ] Go back to login
- [ ] Enter blood bank email and password
- [ ] API succeeds with role="BLOOD_BANK"
- [ ] Navigate to `/(blood-bank-admin)` dashboard

#### Unknown Role Login

- [ ] (If backend returns unknown role)
- [ ] Navigate to `/` (home screen)

### 6. Error Handling Testing

#### Network Errors

- [ ] Disable network
- [ ] Try to register → Show error alert
- [ ] Try to login → Show error alert
- [ ] Re-enable network
- [ ] Retry → Should work

#### Invalid Input

- [ ] Try registration without selecting role
- [ ] Register with invalid email format
- [ ] Register with short password
- [ ] Complete profile with missing required fields
- [ ] Accept invite with password < 8 chars
- [ ] All should show validation alerts

#### API Errors

- [ ] Try registering with existing email
- [ ] Backend should return 409 Conflict or 400 Bad Request
- [ ] Alert displays: "Email already exists" or server message

### 7. Navigation Testing

#### From Login Screen

- [ ] "Create Account" button → Navigate to register
- [ ] "Accept Invite" button → Navigate to accept-invite

#### From Register Screen

- [ ] "Back to Login" button → Navigate to login

#### From Accept Invite Screen

- [ ] "Back to Login" button → Navigate to login

#### From Profile Screen

- [ ] "Back" button → Navigate to register/previous screen

### 8. Token & Storage Testing

#### Token Storage

- [ ] After login/register, tokens are in SecureStore
- [ ] Tokens are not in plain text
- [ ] Tokens persist across app sessions
- [ ] Logout clears tokens

#### Onboarding Storage

- [ ] After completing onboarding, `onboarding_completed` = "true"
- [ ] Persists across app sessions
- [ ] Can be reset for testing

#### Token Decoding

- [ ] Can extract role from token without API call
- [ ] Can extract email from token
- [ ] Can extract user ID from token
- [ ] Can check token expiration

### 9. UI/UX Testing

#### Responsive Design

- [ ] All screens fit different screen sizes
- [ ] Text is readable
- [ ] Buttons are accessible
- [ ] Forms scroll properly on small screens

#### Loading States

- [ ] During API calls, button shows "Loading..." or "Saving..."
- [ ] Button is disabled during loading
- [ ] Cannot submit form twice

#### Button States

- [ ] Buttons are enabled when form is valid
- [ ] "Register" button disabled until role selected
- [ ] "Accept Invite" button disabled during submission

#### Alerts

- [ ] Success alerts are clear and helpful
- [ ] Error alerts show actual error messages
- [ ] Users can dismiss alerts
- [ ] Alerts don't block UI

---

## 📊 Test Case Matrix

| Test Case            | Doctor | Hospital | Blood Bank | Notes                  |
| -------------------- | ------ | -------- | ---------- | ---------------------- |
| Registration         | ❌     | ✅       | ✅         | Via invite only        |
| Profile Completion   | ❌     | ✅       | ✅         | Not needed for doctors |
| Login                | ✅     | ✅       | ✅         | All roles can login    |
| Dashboard Navigation | ✅     | ✅       | ✅         | Role-based routing     |
| Invite Acceptance    | ✅     | ❌       | ❌         | Doctors only           |

---

## 🐛 Bug Report Template

If you encounter bugs during testing:

```
Title: [Brief description of issue]

Component: [Screen name, e.g., "Register Screen"]

Steps to Reproduce:
1. [First step]
2. [Second step]
3. [Third step]

Expected Behavior:
[What should happen]

Actual Behavior:
[What actually happened]

Environment:
- OS: [iOS/Android]
- Device: [Device model]
- App Version: [Current version]
- Backend: [Running/Not running]

Console Logs:
[Any errors from console]

Screenshots:
[Attach if possible]
```

---

## 🚀 Performance Checklist

- [ ] Registration completes in < 3 seconds
- [ ] Profile update completes in < 3 seconds
- [ ] Login completes in < 2 seconds
- [ ] No memory leaks during navigation
- [ ] App doesn't crash on rapid screen transitions
- [ ] Forms validate instantly
- [ ] Token decoding is synchronous and fast

---

## 🔒 Security Checklist

- [ ] Passwords are never logged to console
- [ ] Tokens are only stored in SecureStore
- [ ] API calls include proper Authorization headers
- [ ] No credentials in URL parameters
- [ ] Form data is not stored in plain text
- [ ] HTTPS should be used in production
- [ ] Password fields use secureTextEntry
- [ ] Tokens are cleared on logout

---

## 📱 Device Testing

Test on:

- [ ] iOS device/simulator
- [ ] Android device/emulator
- [ ] Different screen sizes
- [ ] Different OS versions
- [ ] With poor network conditions

---

## Final Validation

Before deploying:

- [ ] All test cases pass
- [ ] No console errors
- [ ] No security issues
- [ ] Documentation is complete
- [ ] Code is properly formatted
- [ ] Comments explain complex logic
- [ ] Error messages are user-friendly
- [ ] All API endpoints are working
- [ ] Token management is secure
- [ ] Role-based navigation works correctly

---

## Deployment Checklist

- [ ] Update API base URL for production
- [ ] Remove console.log statements
- [ ] Test with production backend
- [ ] Update app version number
- [ ] Create release notes
- [ ] Test on physical devices
- [ ] Verify app store build process
- [ ] Plan rollback strategy
- [ ] Monitor error logs post-deployment

---

## Post-Launch Monitoring

- [ ] Monitor error tracking service
- [ ] Check user registration completion rates
- [ ] Monitor API response times
- [ ] Track crash reports
- [ ] Analyze user behavior flows
- [ ] Gather user feedback
- [ ] Plan next iteration improvements

---

## Support & Documentation

- [ ] User documentation for registration
- [ ] API documentation is up-to-date
- [ ] Developer guide for future changes
- [ ] Troubleshooting guide for common issues
- [ ] Architecture decision records (ADRs)
