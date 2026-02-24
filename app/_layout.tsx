import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";
import { AuthProvider, useAuth } from "../src/context";
import queryClient from "../src/lib/queryClient";

function RootNavigationGuard() {
  const { isAuthenticated, isProfileComplete, isLoading, role } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // biome-ignore lint: correctness/useExhaustiveDependencies
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inHospitalGroup = segments[0] === "(hospital-admin)";
    const inBloodBankGroup = segments[0] === "(blood-bank-admin)";
    const inDoctorGroup = segments[0] === "(doctor)";
    const inProtectedGroup =
      inHospitalGroup || inBloodBankGroup || inDoctorGroup;

    if (!isAuthenticated) {
      // Unauthenticated user trying to access a protected area → go to login
      if (inProtectedGroup) {
        router.replace("/(auth)/login");
      }
      return;
    }

    // Authenticated but profile incomplete → block on complete-profile
    if (!isProfileComplete && role !== "DOCTOR") {
      const isOnCompleteProfile =
        inAuthGroup && segments[1] === "complete-profile";
      if (!isOnCompleteProfile) {
        router.replace({
          pathname: "/(auth)/complete-profile",
          params: { role: role ?? "" },
        });
      }
      return;
    }

    // Authenticated + complete → redirect away from auth screens to their dashboard
    if (isAuthenticated && isProfileComplete && inAuthGroup) {
      if (role === "HOSPITAL") {
        router.replace("/(hospital-admin)/");
      } else if (role === "BLOOD_BANK") {
        router.replace("/(blood-bank-admin)/");
      } else if (role === "DOCTOR") {
        router.replace("/(doctor)/");
      }
    }
  }, [isAuthenticated, isProfileComplete, isLoading, role, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootNavigationGuard />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
