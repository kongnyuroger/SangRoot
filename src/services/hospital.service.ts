import { api, safeRequest } from "../lib/api";

type InviteDoctorDto = {
  doctorEmail: string;
  hospitalId?: string;
};

export async function inviteDoctor(data: InviteDoctorDto) {
  return safeRequest(
    api.post("hospitals/invite-doctor", { json: data }).json(),
  );
}

export default inviteDoctor;
