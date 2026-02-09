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

type InviteDoctorDto = {
  email: string;
  hospitalId?: string; // Optional if inferred from token
};

export async function registerDonor(data: RegisterDonorDto) {
  return api.post("hospitals/donors", { json: data }).json();
}

export async function inviteDoctor(data: InviteDoctorDto) {
  return api.post("hospitals/invite-doctor", { json: data }).json();
}

export default { registerDonor, inviteDoctor };
