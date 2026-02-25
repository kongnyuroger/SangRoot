import { api } from "../lib/api";

type RegisterDonorDto = {
  name: string;
  email?: string;
  phone: string;
  bloodGroup: string;
  dateBirth: string;
  region: string;
  town: string;
  neighbourhood?: string;
  genre: string;
};

export async function registerDonor(data: RegisterDonorDto) {
  return api.post("blood-banks/donors", { json: data }).json();
}

export default { registerDonor };
