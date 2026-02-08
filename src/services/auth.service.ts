import { rawClient } from "../lib/api";
import {
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../lib/authStorage";

type LoginRes = { accessToken: string; refreshToken?: string };

export async function login(
  email: string,
  password: string,
): Promise<LoginRes> {
  const res = await rawClient
    .post("auth/login", { json: { email, password } })
    .json<LoginRes>();
  if (res.accessToken) {
    await setAccessToken(res.accessToken);
  }
  if (res.refreshToken) {
    await setRefreshToken(res.refreshToken);
  }
  return res;
}

export async function register(
  email: string,
  password: string,
  role?: string,
): Promise<LoginRes> {
  const res = await rawClient
    .post("auth/register", { json: { email, password, role } })
    .json<LoginRes>();
  if (res.accessToken) await setAccessToken(res.accessToken);
  if (res.refreshToken) await setRefreshToken(res.refreshToken ?? "");
  return res;
}

export async function logout(): Promise<void> {
  try {
    await rawClient
      .post("auth/logout", { json: {} })
      .json()
      .catch(() => null);
  } finally {
    await removeAccessToken();
    await removeRefreshToken();
  }
}

export async function refreshToken(): Promise<{ accessToken?: string } | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await rawClient
      .post("auth/refresh", { json: { refreshToken } })
      .json<{ accessToken: string; refreshToken?: string }>();
    if (res?.accessToken) {
      await setAccessToken(res.accessToken);
    }
    if (res?.refreshToken) {
      await setRefreshToken(res.refreshToken);
    }
    return { accessToken: res.accessToken };
  } catch (e) {
    await removeAccessToken();
    await removeRefreshToken();
    return null;
  }
}

export default { login, logout, register, refreshToken };
