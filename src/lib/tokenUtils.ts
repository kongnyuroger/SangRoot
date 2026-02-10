/**
 * JWT Token Utilities
 * Helper functions for decoding and working with JWT tokens
 */

interface DecodedToken {
  sub?: string;
  role?: string;
  email?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

/**
 * Decode a JWT token without verification
 * NOTE: This only decodes the payload - verification should be done on the backend
 */
import { jwtDecode } from "jwt-decode";

/**
 * Decode a JWT token without verification
 * NOTE: This only decodes the payload - verification should be done on the backend
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

/**
 * Get the user role from a JWT token
 */
export function getTokenRole(token: string): string | null {
  const decoded = decodeToken(token);
  return decoded?.role || null;
}

/**
 * Get the user email from a JWT token
 */
export function getTokenEmail(token: string): string | null {
  const decoded = decodeToken(token);
  return decoded?.email || null;
}

/**
 * Get the user ID (sub claim) from a JWT token
 */
export function getTokenUserId(token: string): string | null {
  const decoded = decodeToken(token);
  return decoded?.sub || null;
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  return Date.now() >= decoded.exp * 1000;
}

export default {
  decodeToken,
  getTokenRole,
  getTokenEmail,
  getTokenUserId,
  isTokenExpired,
};
