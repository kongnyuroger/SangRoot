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

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inHospitalGroup = segments[0] === "(hospital-admin)";
    const inBloodBankGroup = segments[0] === "(blood-bank-admin)";
    const inDoctorGroup = segments[0] === "(doctor)";
    const inProtectedGroup =
      inHospitalGroup ||
      inBloodBankGroup ||
      inDoctorGroup ||
      segments[0] === "edit-profile";

    if (!isAuthenticated) {
      if (inProtectedGroup) {
        router.replace("/(auth)/login");
      }
      return;
    }

    if (!isProfileComplete && role !== "DOCTOR") {
      const isOnCompleteProfile = inAuthGroup && segments[1] === "complete-profile";
      if (!isOnCompleteProfile) {
        router.replace({
          pathname: "/(auth)/complete-profile",
          params: { role: role ?? "" },
        });
      }
      return;
    }

    // Fix: Use role string comparison safely
    if (isAuthenticated && isProfileComplete && inAuthGroup) {
      const userRole = role as string;
      if (userRole === "HOSPITAL") {
        router.replace({ pathname: "/(hospital-admin)" });
      } else if (userRole === "BLOOD_BANK") {
        router.replace({ pathname: "/(blood-bank-admin)" });
      } else if (userRole === "DOCTOR") {
        router.replace({ pathname: "/(doctor)" });
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
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(doctor)" options={{ headerShown: false }} />
          <Stack.Screen name="(hospital-admin)" options={{ headerShown: false }} />
          <Stack.Screen name="(blood-bank-admin)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}