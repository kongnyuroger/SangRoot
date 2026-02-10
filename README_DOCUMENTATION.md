# SangRoot Application Documentation

## 📚 Documentation Files Overview

This directory contains comprehensive documentation for the refactored SangRoot application. Below is a guide to help you navigate the documentation:

### 1. **IMPLEMENTATION_SUMMARY.md** - START HERE

**Purpose:** Quick overview of all changes made  
**For:** Everyone - especially new team members  
**Contains:**

- Summary of all updated files
- User journey diagrams
- API endpoints ready for integration
- File changes at a glance
- Next steps and testing

### 2. **FLOW_REFACTOR.md**

**Purpose:** Detailed explanation of the overall app flow and onboarding  
**For:** Developers implementing the flow  
**Contains:**

- Complete user journeys for first-time users
- Onboarding flow details
- File structure organization
- Navigation flow diagrams
- Onboarding state management
- Implementation notes

### 3. **REGISTRATION_FLOW.md**

**Purpose:** In-depth guide to registration, profile completion, and doctor invites  
**For:** Developers working on auth flows  
**Contains:**

- Detailed registration process
- Hospital/Blood Bank profile completion steps
- Doctor invite acceptance flow
- Complete API request/response examples
- Key components and utilities
- Error handling strategies
- Testing checklist
- Future enhancements

### 4. **LOGIN_FLOW.md** (Detailed Login)

Covered in REGISTRATION_FLOW.md - Section 4  
**For:** Understanding role-based navigation

### 5. **FLOW_DIAGRAMS.md**

**Purpose:** Visual representations of all application flows  
**For:** Visual learners, process documentation  
**Contains:**

- Overall user journey map
- Detailed flow diagrams
- Registration flow diagram
- Doctor invite flow diagram
- Login flow with role-based routing
- State management structure
- JWT token structure
- Component hierarchy
- Error flow diagram

### 6. **API_REFERENCE.md**

**Purpose:** Complete API documentation with examples  
**For:** Backend integration, testing, API calls  
**Contains:**

- Base URL and endpoints
- Authentication endpoints (register, login, accept-invite, refresh, logout)
- Profile endpoints (hospital, blood bank)
- Common error codes
- cURL testing examples
- Environment variables
- Response handling patterns
- Token usage patterns

### 7. **TESTING_CHECKLIST.md**

**Purpose:** Comprehensive testing guide  
**For:** QA, developers, anyone testing the app  
**Contains:**

- Completed tasks checklist
- Testing checklist for all flows
- Test case matrix
- Bug report template
- Performance checklist
- Security checklist
- Device testing guide
- Deployment checklist
- Post-launch monitoring

---

## 🚀 Quick Start Guide

### For New Developers:

1. Read: **IMPLEMENTATION_SUMMARY.md** (5 minutes)
2. Read: **FLOW_DIAGRAMS.md** (10 minutes)
3. Read: **REGISTRATION_FLOW.md** (15 minutes)
4. Reference: **API_REFERENCE.md** as needed

### For Backend Developers:

1. Read: **API_REFERENCE.md** (10 minutes)
2. Reference: **REGISTRATION_FLOW.md** for request/response formats
3. Check: **TESTING_CHECKLIST.md** for validation requirements

### For QA/Testers:

1. Read: **TESTING_CHECKLIST.md** (20 minutes)
2. Reference: **FLOW_DIAGRAMS.md** for understanding flows
3. Use: **API_REFERENCE.md** for cURL testing commands

### For Project Managers:

1. Read: **IMPLEMENTATION_SUMMARY.md** (5 minutes)
2. Read: **FLOW_DIAGRAMS.md** (10 minutes)
3. Reference: **TESTING_CHECKLIST.md** for progress tracking

---

## 📁 File Organization

```
sangRoot/
├── IMPLEMENTATION_SUMMARY.md    ← START HERE
├── FLOW_REFACTOR.md             ← Overall app structure
├── REGISTRATION_FLOW.md         ← Auth flows detailed
├── FLOW_DIAGRAMS.md             ← Visual diagrams
├── API_REFERENCE.md             ← API documentation
├── TESTING_CHECKLIST.md         ← Testing guide
│
├── app/
│   ├── index.tsx                ← Home screen
│   ├── _layout.tsx              ← Root layout
│   └── (auth)/
│       ├── _layout.tsx
│       ├── onboarding-1.tsx     ← NEW
│       ├── onboarding-2.tsx     ← NEW
│       ├── onboarding-3.tsx     ← NEW
│       ├── login.tsx            ← NEW (enhanced)
│       ├── register.tsx         ← UPDATED
│       ├── complete-profile.tsx ← UPDATED
│       └── accept-invite.tsx    ← NEW
│
└── src/
    └── lib/
        ├── authStorage.ts       ← UPDATED
        └── tokenUtils.ts        ← NEW
```

---

## 🔄 Application Flows Summary

### 1️⃣ **First-Time User (Hospital/Blood Bank)**

```
Onboarding → Register (select role) → Complete Profile → Dashboard
```

### 2️⃣ **First-Time User (Doctor via Invite)**

```
Accept Invite (fill doctor details) → Doctor Dashboard
```

### 3️⃣ **Returning User**

```
Login → Dashboard (based on role)
```

### 4️⃣ **Role-Based Navigation After Login**

- **DOCTOR** → `/(doctor)`
- **HOSPITAL** → `/(hospital-admin)`
- **BLOOD_BANK** → `/(blood-bank-admin)`

---

## 🎯 Key Features Implemented

✅ **Onboarding System** - 3 screens with completion detection  
✅ **Role-Based Registration** - Select role during signup  
✅ **Profile Completion** - Role-specific forms  
✅ **Doctor Invite System** - Special registration via invite code  
✅ **Smart Login Navigation** - Automatic routing based on role  
✅ **JWT Token Utilities** - Decode tokens locally  
✅ **Comprehensive Error Handling** - User-friendly messages  
✅ **Loading States** - Visual feedback during API calls  
✅ **Form Validation** - Required field validation

---

## 📝 What Changed

### New Files Created:

- `app/(auth)/onboarding-1.tsx`
- `app/(auth)/onboarding-2.tsx`
- `app/(auth)/onboarding-3.tsx`
- `app/(auth)/login.tsx`
- `app/(auth)/accept-invite.tsx`
- `src/lib/tokenUtils.ts`

### Files Updated:

- `app/(auth)/register.tsx` - Added role selection
- `app/(auth)/complete-profile.tsx` - Role-specific forms
- `app/index.tsx` - Onboarding detection
- `src/lib/authStorage.ts` - Onboarding functions

### Files Deprecated (Can be removed):

- `app/(auth)/doctor-login.tsx`
- `app/(auth)/hospital-admin-login.tsx`
- `app/(auth)/blood-bank-admin-login.tsx`

---

## 🔗 API Endpoints

### Authentication

- `POST /auth/register` - Register with role
- `POST /auth/login` - Login
- `POST /auth/accept-invite` - Doctor invite registration
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout

### Profiles

- `POST /hospitals/profile` - Complete hospital profile
- `POST /blood-banks/profile` - Complete blood bank profile

---

## 🧪 Testing

All documentation includes testing guidelines:

1. **Unit Testing** - Test individual components
2. **Integration Testing** - Test API integration
3. **End-to-End Testing** - Test complete flows
4. **Security Testing** - Verify token handling
5. **Performance Testing** - Check API response times

See **TESTING_CHECKLIST.md** for detailed testing procedures.

---

## 🔒 Security Highlights

- ✅ Tokens stored in SecureStore (encrypted)
- ✅ JWT tokens decoded locally for role determination
- ✅ Passwords use `secureTextEntry`
- ✅ All API calls include Authorization headers
- ✅ No credentials stored in plain text
- ✅ Proper error handling without exposing sensitive data

---

## 📊 Example Flows

### Hospital Registration (Complete Flow)

```
1. App Launch → Onboarding (3 screens)
2. Login Screen → Select "Create Account"
3. Register Screen → Select HOSPITAL role
4. Enter email/password → POST /auth/register
5. Complete Profile Screen → Fill hospital details
6. POST /hospitals/profile → Success
7. Navigate to Hospital Admin Dashboard
```

### Doctor Accept Invite (Complete Flow)

```
1. Login Screen → Select "Accept Invite"
2. Fill doctor details (name, email, password, etc.)
3. POST /auth/accept-invite
4. Store tokens in SecureStore
5. Navigate to Doctor Dashboard
```

### Login & Navigation (Complete Flow)

```
1. Login Screen → Enter credentials
2. POST /auth/login → Get tokens
3. Decode JWT token → Extract role
4. Navigate based on role:
   - DOCTOR → /(doctor)
   - HOSPITAL → /(hospital-admin)
   - BLOOD_BANK → /(blood-bank-admin)
```

---

## 🛠️ Development Setup

### Prerequisites

- Node.js installed
- npm or yarn package manager
- Expo CLI installed
- Backend server running on `http://localhost:3000`

### Running the App

```bash
npm install
npx expo start
```

### Testing API Endpoints

See **API_REFERENCE.md** for cURL examples:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "pass123", "role": "HOSPITAL"}'
```

---

## 📞 Common Issues & Solutions

### Issue: Onboarding keeps showing on subsequent launches

**Solution:** Check that `onboarding_completed` is being set in AsyncStorage

### Issue: Login doesn't route to correct dashboard

**Solution:** Verify JWT token contains `role` claim and token decoding works

### Issue: Profile API returns 401 Unauthorized

**Solution:** Ensure Authorization header includes Bearer token

### Issue: Forms not validating required fields

**Solution:** Check field validation logic in screen components

See **TESTING_CHECKLIST.md** for more troubleshooting steps.

---

## 🚀 Deployment

Before deploying:

1. ✅ Complete all tests from **TESTING_CHECKLIST.md**
2. ✅ Update API base URL for production
3. ✅ Review security checklist in **TESTING_CHECKLIST.md**
4. ✅ Test with production backend
5. ✅ Create release notes
6. ✅ Monitor error logs post-deployment

---

## 📈 Performance Targets

- Registration: < 3 seconds
- Profile Update: < 3 seconds
- Login: < 2 seconds
- Form Validation: Instant
- Navigation: Smooth transitions

---

## 🎓 Learning Resources

### Token Handling

```typescript
import { decodeToken, getTokenRole } from "@/lib/tokenUtils";

const token = await getAccessToken();
const role = getTokenRole(token); // Returns: "DOCTOR" | "HOSPITAL" | "BLOOD_BANK"
```

### Making API Calls

```typescript
const response = await fetch("http://localhost:3000/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});
```

### Form Validation

```typescript
if (!formData.name || !formData.phone) {
  Alert.alert("Required Fields", "Please fill in all fields");
  return;
}
```

---

## 💡 Tips & Best Practices

1. **Always decode tokens locally** - Don't trust frontend token claims alone
2. **Use proper Authorization headers** - All protected endpoints need Bearer token
3. **Handle loading states** - Disable buttons during API calls
4. **Show user-friendly errors** - Don't expose technical error details
5. **Validate forms before submission** - Reduce unnecessary API calls
6. **Test on real devices** - Simulator behavior may differ
7. **Monitor API response times** - Optimize slow endpoints
8. **Keep documentation updated** - As code changes, update docs

---

## 🔄 Version History

### Current Version: 2.0

- ✅ Onboarding system added
- ✅ Role-based registration
- ✅ Profile completion flows
- ✅ Doctor invite system
- ✅ Smart login navigation
- ✅ Comprehensive documentation

### Previous: 1.0

- Basic login/register
- No onboarding
- Role selection in backend

---

## 📧 Support & Questions

For questions about:

- **Implementation**: Check the relevant markdown file above
- **API Integration**: See **API_REFERENCE.md**
- **Testing**: See **TESTING_CHECKLIST.md**
- **Flows**: See **FLOW_DIAGRAMS.md** and **REGISTRATION_FLOW.md**

---

## 📄 License

[Add your license information here]

---

## 🎉 Next Steps

1. **For Developers**: Start with **IMPLEMENTATION_SUMMARY.md** and **REGISTRATION_FLOW.md**
2. **For Testers**: Use **TESTING_CHECKLIST.md** as your testing guide
3. **For Backend**: Reference **API_REFERENCE.md** for endpoint specifications
4. **For Everyone**: Keep documentation updated as code evolves

---

**Last Updated:** February 7, 2026  
**Documentation Version:** 1.0  
**Status:** Complete and Ready for Implementation
