import { api, safeRequest } from "../lib/api";

type RegisterDonorDto = {
  name: string;
  email?: string;
  phone: string;
  bloodGroup: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  isAvailable?: boolean;
};

export async function registerDonor(data: RegisterDonorDto) {
  return safeRequest(api.post("doctors/donors", { json: data }).json());
}

export default { registerDonor };
