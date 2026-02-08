import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { hasCompletedOnboarding } from "../src/lib/authStorage";

export default function RootScreen() {
  const router = useRouter();
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnb, setHasCompletedOnboarding] = useState(false);
  // biome-ignore lint: correctness/useExhaustiveDependencies
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const completed = await hasCompletedOnboarding();
        setHasCompletedOnboarding(completed);
        setIsLoading(false);

        // If onboarding not completed, redirect to onboarding
        if (!completed) {
          router.replace("/(auth)/onboarding-1");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>SangRoot</Text>
      <Text style={{ fontSize: 16, marginBottom: 24 }}>
        Welcome! Choose how you want to log in
      </Text>

      <View style={{ width: "80%", gap: 12 }}>
        <Button
          title="Login as Doctor"
          onPress={() => router.push("/(auth)/login")}
        />
        <Button
          title="Register"
          onPress={() => router.push("/(auth)/register")}
        />
        <Button
          title="Accept Invite"
          onPress={() => router.push("/(auth)/accept-invite")}
        />
      </View>
    </View>
  );
}
