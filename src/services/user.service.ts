import { api, safeRequest } from "../lib/api";
import { getAccessToken } from "../lib/authStorage";
import { getTokenRole } from "../lib/tokenUtils";

export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role?: string;
  [key: string]: unknown;
};

export async function getProfile(): Promise<UserProfile> {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token found");

  const role = getTokenRole(token);
  let endpoint = "";

  switch (role) {
    case "HOSPITAL":
      endpoint = "hospitals/profile";
      break;
    case "BLOOD_BANK":
      endpoint = "blood-banks/profile";
      break;
    case "DOCTOR":
      // Assuming doctors/profile exists, or we might need to check the backend
      endpoint = "doctors/profile";
      break;
    default:
      throw new Error("Unknown user role");
  }

  return safeRequest(api.get(endpoint).json<UserProfile>());
}

export async function updateProfile(
  data: Partial<UserProfile>,
): Promise<UserProfile> {
  const token = await getAccessToken();
  if (!token) throw new Error("No access token found");

  const role = getTokenRole(token);
  let endpoint = "";

  switch (role) {
    case "HOSPITAL":
      endpoint = "hospitals/profile";
      break;
    case "BLOOD_BANK":
      endpoint = "blood-banks/profile";
      break;
    case "DOCTOR":
      endpoint = "doctors/profile";
      break;
    default:
      throw new Error("Unknown user role");
  }

  return safeRequest(api.patch(endpoint, { json: data }).json<UserProfile>());
}

export default { getProfile, updateProfile };
