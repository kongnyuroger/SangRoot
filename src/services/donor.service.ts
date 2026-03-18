import { api, safeRequest } from "../lib/api";

export type RegisterDonorDto = {
  name: string;
  phone: string;
  email?: string;
  bloodGroup: string;
  dateBirth: string;
  region: string;
  town: string;
  neighbourhood?: string;
  genre: string;
};

// ─── Donor ────────────────────────────────────────────────────────────────────

/**
 * Shared across BloodBank, Hospital, and Doctor modules.
 * The backend identifies the registering entity from the auth token.
 */
export async function registerDonor(data: RegisterDonorDto) {
  return safeRequest(api.post("donors/register", { json: data }).json());
}
