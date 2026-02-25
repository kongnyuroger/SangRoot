export const BLOOD_GROUP_MAP: Record<string, string> = {
  "A+": "A_POSITIVE",
  "A-": "A_NEGATIVE",
  "B+": "B_POSITIVE",
  "B-": "B_NEGATIVE",
  "AB+": "AB_POSITIVE",
  "AB-": "AB_NEGATIVE",
  "O+": "O_POSITIVE",
  "O-": "O_NEGATIVE",
};

export const REVERSE_BLOOD_GROUP_MAP: Record<string, string> =
  Object.fromEntries(Object.entries(BLOOD_GROUP_MAP).map(([k, v]) => [v, k]));

export const mapBloodGroupToBackend = (bg: string) => BLOOD_GROUP_MAP[bg] || bg;
export const mapBloodGroupToFrontend = (bg: string) =>
  REVERSE_BLOOD_GROUP_MAP[bg] || bg;
