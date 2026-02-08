# API Quick Reference Guide

## Base URL

```
http://localhost:3000
```

---

## Authentication Endpoints

### 1. Register

Register a new user with role selection.

**Endpoint:** `POST /auth/register`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "DOCTOR" | "HOSPITAL" | "BLOOD_BANK"
}
```

**Successful Response (201/200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "optional_refresh_token",
  "user": {
    "id": "user-id-uuid",
    "email": "user@example.com",
    "role": "HOSPITAL"
  }
}
```

**Error Response (4xx):**

```json
{
  "message": "Email already exists",
  "statusCode": 400
}
```

**Implementation:**

- File: `src/services/auth.service.ts` - `register()`
- Hook: `src/hooks/useAuthHooks.ts` - `useRegister()`
- Screen: `app/(auth)/register.tsx`

---

### 2. Login

Authenticate existing user.

**Endpoint:** `POST /auth/login`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Successful Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "optional_refresh_token",
  "user": {
    "id": "user-id-uuid",
    "email": "user@example.com",
    "role": "DOCTOR"
  }
}
```

**Implementation:**

- File: `src/services/auth.service.ts` - `login()`
- Hook: `src/hooks/useAuthHooks.ts` - `useLogin()`
- Screen: `app/(auth)/login.tsx`

---

### 3. Accept Invite (Doctor Registration)

Register a doctor using an invite code.

**Endpoint:** `POST /auth/accept-invite`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "inviteId": "31a9f23f-ebd9-41f9-982f-eeb79b04e247",
  "name": "Dr. John Smith",
  "email": "john.smith@example.com",
  "password": "securePassword123",
  "phone": "+1234567890",
  "registrationNo": "MED-123456",
  "specialization": "Cardiology"
}
```

**Successful Response (201/200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "optional_refresh_token",
  "user": {
    "id": "doctor-id-uuid",
    "email": "john.smith@example.com",
    "role": "DOCTOR"
  }
}
```

**Implementation:**

- Screen: `app/(auth)/accept-invite.tsx`
- No existing hook (custom implementation in screen)

---

### 4. Refresh Token

Get a new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "refreshToken": "existing_refresh_token"
}
```

**Successful Response (200):**

```json
{
  "accessToken": "new_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "optional_new_refresh_token"
}
```

**Implementation:**

- File: `src/services/auth.service.ts` - `refreshToken()`

---

### 5. Logout

Logout user and invalidate tokens.

**Endpoint:** `POST /auth/logout`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {accessToken}
```

**Request Body:**

```json
{}
```

**Successful Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

**Implementation:**

- File: `src/services/auth.service.ts` - `logout()`

---

## Profile Endpoints

### 6. Hospital Profile

Complete hospital administrator profile.

**Endpoint:** `POST /hospitals/profile`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {accessToken}
```

**Request Body:**

```json
{
  "name": "General Hospital",
  "address": "121 Health Street",
  "city": "Yaounde",
  "state": "Centre",
  "pincode": "00000",
  "phone": "2343423443",
  "latitude": null,
  "longitude": null,
  "licenseNumber": "LIC-HOS-12345"
}
```

**Successful Response (200/201):**

```json
{
  "id": "hospital-id-uuid",
  "name": "General Hospital",
  "address": "121 Health Street",
  "city": "Yaounde",
  "state": "Centre",
  "pincode": "00000",
  "phone": "2343423443",
  "latitude": null,
  "longitude": null,
  "licenseNumber": "LIC-HOS-12345",
  "userId": "user-id-uuid"
}
```

**Implementation:**

- Screen: `app/(auth)/complete-profile.tsx`
- Called after hospital registration

---

### 7. Blood Bank Profile

Complete blood bank administrator profile.

**Endpoint:** `POST /blood-banks/profile`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer {accessToken}
```

**Request Body:**

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

**Successful Response (200/201):**

```json
{
  "id": "blood-bank-id-uuid",
  "name": "CNTS Blood Bank",
  "address": "121 Health Street",
  "city": "Yaounde",
  "state": "Centre",
  "pincode": "00000",
  "phone": "2343423443",
  "latitude": null,
  "longitude": null,
  "licenseNumber": "LIC-BB-456",
  "userId": "user-id-uuid"
}
```

**Implementation:**

- Screen: `app/(auth)/complete-profile.tsx`
- Called after blood bank registration

---

## Common Error Codes

| Code | Message               | Solution                           |
| ---- | --------------------- | ---------------------------------- |
| 400  | Bad Request           | Check request body format          |
| 401  | Unauthorized          | Token missing or invalid           |
| 403  | Forbidden             | Insufficient permissions           |
| 404  | Not Found             | Endpoint or resource doesn't exist |
| 409  | Conflict              | Email already exists               |
| 422  | Unprocessable Entity  | Validation error - check fields    |
| 500  | Internal Server Error | Server error - try again later     |

---

## Authentication Flow Summary

```
1. User Registration
   POST /auth/register
   → Stores tokens
   → Navigate to /auth/complete-profile

2. Complete Profile
   POST /hospitals/profile | /blood-banks/profile
   → Navigate to dashboard

3. Login
   POST /auth/login
   → Decode token for role
   → Navigate to role-based dashboard

4. Token Refresh (Auto)
   POST /auth/refresh
   → Get new access token

5. Logout
   POST /auth/logout
   → Clear tokens
   → Navigate to login
```

---

## Testing with cURL

### Register Hospital

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hospital3@example.com",
    "password": "securepassword1234",
    "role": "HOSPITAL"
  }'
```

### Complete Hospital Profile

```bash
curl -X POST http://localhost:3000/hospitals/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "General Hospital",
    "address": "121 Main Street",
    "city": "Yaounde",
    "state": "Centre",
    "pincode": "00000",
    "phone": "2343423443",
    "latitude": null,
    "longitude": null,
    "licenseNumber": "LIC-12345"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hospital3@example.com",
    "password": "securepassword1234"
  }'
```

### Accept Invite

```bash
curl -X POST http://localhost:3000/auth/accept-invite \
  -H "Content-Type: application/json" \
  -d '{
    "inviteId": "31a9f23f-ebd9-41f9-982f-eeb79b04e247",
    "name": "Dr. Roger",
    "email": "roger@example.com",
    "password": "securePassword123",
    "phone": "12345",
    "registrationNo": "123444",
    "specialization": "Cardiology"
  }'
```

---

## Environment Variables

Create a `.env` file in your project root:

```
API_BASE_URL=http://localhost:3000
ENABLE_LOGGING=true
```

Usage in code:

```typescript
const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";
```

---

## Response Handling Pattern

```typescript
try {
  const response = await fetch(`${baseUrl}/endpoint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  const result = await response.json();
  // Handle success
} catch (error) {
  // Handle error
  Alert.alert("Error", error.message);
}
```

---

## Token Usage Pattern

```typescript
// Get token
const token = await getAccessToken();

// Decode token
const decoded = decodeToken(token);
const role = getTokenRole(token);

// Use in requests
const response = await fetch(url, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Check expiration
if (isTokenExpired(token)) {
  // Refresh token
  const newToken = await refreshToken();
}
```
