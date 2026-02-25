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

type InviteDoctorDto = {
  doctorEmail: string;
  hospitalId?: string; // Optional if inferred from token
};

export async function registerDonor(data: RegisterDonorDto) {
  return api.post("hospitals/donors", { json: data }).json();
}

export async function inviteDoctor(data: InviteDoctorDto) {
  return api.post("hospitals/invite-doctor", { json: data }).json();
}

export default { registerDonor, inviteDoctor };
