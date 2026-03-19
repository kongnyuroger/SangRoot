import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authService from "../services/auth.service";
import * as userService from "../services/user.service";

export function useLogin() {
  const qc = useQueryClient();
  return useMutation(
    ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    {
      onSuccess: async () => {
        await qc.invalidateQueries(["profile"]);
      },
    },
  );
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation(
    ({
      email,
      password,
      role,
    }: {
      email: string;
      password: string;
      role?: string;
    }) => authService.register(email, password, role),
    {
      onSuccess: async () => {
        await qc.invalidateQueries(["profile"]);
      },
    },
  );
}

export function useProfile() {
  return useQuery(["profile"], () => userService.getProfile(), {
    enabled: true,
  });
}
type UpdateProfileInput = Record<string, unknown>;

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation(
    (data: UpdateProfileInput) => userService.updateProfile(data),
    {
      onSuccess: () => qc.invalidateQueries(["profile"]),
    },
  );
}

export function useGoogleAuth() {
  const qc = useQueryClient();
  const mutation = useMutation(
    ({ idToken, role }: { idToken: string; role?: string }) =>
      authService.googleLogin(idToken, role),
    {
      onSuccess: async () => {
        await qc.invalidateQueries(["profile"]);
      },
    },
  );

  return mutation;
}
