import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AuthHeader } from "../src/components/auth/AuthHeader";
import { StyledButton } from "../src/components/auth/StyledButton";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../src/constants/theme";
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
      <View style={styles.loadingContainer}>
        <View style={styles.logoContainer}>
          <Ionicons name="water" size={48} color={colors.primary} />
        </View>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AuthHeader
          icon="water"
          title="SangRoot"
          subtitle="Choose how you want to access the platform"
        />

        <View style={styles.optionsContainer}>
          <View style={styles.optionCard}>
            <View style={styles.optionIconContainer}>
              <Ionicons
                name="medical-outline"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.optionTitle}>Medical Professional</Text>
            <Text style={styles.optionDescription}>
              Login as a doctor or healthcare provider
            </Text>
            <StyledButton
              title="Login"
              onPress={() => router.push("/(auth)/login")}
            />
          </View>

          <View style={styles.optionCard}>
            <View style={styles.optionIconContainer}>
              <Ionicons
                name="business-outline"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.optionTitle}>New Organization</Text>
            <Text style={styles.optionDescription}>
              Register your hospital or blood bank
            </Text>
            <StyledButton
              title="Register"
              onPress={() => router.push("/(auth)/register")}
              variant="outline"
            />
          </View>

          <View style={styles.optionCard}>
            <View style={styles.optionIconContainer}>
              <Ionicons
                name="person-add-outline"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.optionTitle}>Have an Invite?</Text>
            <Text style={styles.optionDescription}>
              Join as a verified professional
            </Text>
            <StyledButton
              title="Accept Invite"
              onPress={() => router.push("/(auth)/accept-invite")}
              variant="outline"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    gap: spacing.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: "center",
  },
  optionsContainer: {
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  optionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
});
