import api from "../lib/api";

export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  [key: string]: unknown;
};

export async function getProfile(): Promise<UserProfile> {
  return api.get("users/me").json<UserProfile>();
}

export async function updateProfile(
  data: Partial<UserProfile>,
): Promise<UserProfile> {
  return api.patch("users/me", { json: data }).json<UserProfile>();
}

export default { getProfile, updateProfile };
