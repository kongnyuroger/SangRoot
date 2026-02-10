import ky, { HTTPError, type Options } from "ky";
import { Platform } from "react-native";
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./authStorage";

// Backend URL configuration for different platforms
// IMPORTANT: Change this based on where you're testing:
// - iOS Simulator: "http://localhost:3000"
// - Android Emulator: "http://10.0.2.2:3000"
// - Physical Device: "http://YOUR_IP:3000" (e.g., "http://192.168.1.53:3000")

const BACKEND_URLS = {
  ios: "http://localhost:3000",
  android: "http://10.0.2.2:3000",
  // For physical device testing, uncomment and set your IP:
  // default: "http://192.168.1.53:3000",
};

const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  BACKEND_URLS[Platform.OS as keyof typeof BACKEND_URLS] ||
  BACKEND_URLS.ios;

console.log("🔧 API Configuration:");
console.log("  Platform:", Platform.OS);
console.log("  EXPO_PUBLIC_BACKEND_URL:", process.env.EXPO_PUBLIC_BACKEND_URL);
console.log("  BACKEND_URL:", BACKEND_URL);
type RetryOptions = Options & {
  _retry?: boolean;
};

// raw client without hooks for internal calls (refresh)
export const rawClient = ky.create({
  prefixUrl: BACKEND_URL,
  timeout: 10000,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

export const api = ky.create({
  prefixUrl: BACKEND_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        try {
          const token = await getAccessToken();
          if (token) {
            request.headers.set("authorization", `Bearer ${token}`);
          }
        } catch (e) {
          // silent - storage failure should not crash app
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status !== 401) return;

        // avoid refreshing on refresh endpoint or when explicitly flagged
        const url = request.url.replace(/\?.*$/, "");
        if (
          url.endsWith("/auth/refresh") ||
          (options && (options as RetryOptions)._retry)
        ) {
          return;
        }

        // attempt refresh using raw client and SecureStore directly (avoid circular imports)
        try {
          const refreshToken = await getRefreshToken();
          if (!refreshToken) throw new Error("no refresh token");
          const refreshRes = await rawClient
            .post("auth/refresh", { json: { refreshToken } })
            .json<{ accessToken: string; refreshToken?: string }>();
          if (refreshRes?.accessToken) {
            await setAccessToken(refreshRes.accessToken);
            if (refreshRes.refreshToken)
              await setRefreshToken(refreshRes.refreshToken);
            // retry original request with new token
            return ky(request, {
              ...options,
              headers: {
                ...options.headers,
                authorization: `Bearer ${refreshRes.accessToken}`,
              },
              _retry: true,
            } as RetryOptions);
          }
        } catch (err) {
          // refresh failed - clear tokens and allow original 401 to propagate
          await removeAccessToken();
          await removeRefreshToken();
        }
      },
    ],
  },
});

export type ApiError = { message?: string };

export async function safeRequest<T>(p: Promise<T>): Promise<T> {
  try {
    return await p;
  } catch (e) {
    if (e instanceof HTTPError) {
      const body = await e.response.text().catch(() => null);
      let message = e.message;
      try {
        const parsed = body ? JSON.parse(body) : null;
        message = parsed?.message || parsed?.error || message;
      } catch (_) {}
      throw new Error(message || "Network error");
    }
    throw e;
  }
}

export default api;
