import { api } from "../lib/api";

type RegisterDonorDto = {
  name: string;
  bloodGroup: string;
  phone: string;
  email?: string;
  age: number;
  lastDonationDate?: string;
  gender: string;
};

export async function registerDonor(data: RegisterDonorDto) {
  return api.post("blood-banks/donors", { json: data }).json();
}

export default { registerDonor };
