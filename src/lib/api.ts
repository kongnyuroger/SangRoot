import ky, { HTTPError } from "ky";
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./authStorage";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
type RetryOptions = {
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
      async ({ request, options, response, retryWithMergedOptions }) => {
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
            return retryWithMergedOptions({
              headers: { authorization: `Bearer ${refreshRes.accessToken}` },
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
