import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthCard } from "../../src/components/auth/AuthCard";
import { AuthHeader } from "../../src/components/auth/AuthHeader";
import { StyledButton } from "../../src/components/auth/StyledButton";
import { StyledInput } from "../../src/components/auth/StyledInput";
import { colors, spacing, typography } from "../../src/constants/theme";
import { useLogin } from "../../src/hooks/useAuthHooks";
import { getAccessToken } from "../../src/lib/authStorage";
import { getTokenRole } from "../../src/lib/tokenUtils";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const mutation = useLogin();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Required Fields", "Please enter both email and password");
      return;
    }

    try {
      await mutation.mutateAsync({ email, password });

      // Get user role from token and navigate accordingly
      const token = await getAccessToken();
      const role = token ? getTokenRole(token) : null;

      if (role === "DOCTOR") {
        router.replace("/(doctor)/request");
      } else if (role === "HOSPITAL") {
        router.replace("/(hospital-admin)/register-donor");
      } else if (role === "BLOOD_BANK") {
        router.replace("/(blood-bank-admin)/register-donor");
      } else {
        // Fallback to home
        router.replace("/");
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      Alert.alert("Login failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          icon="medical"
          title="Healthcare Portal"
          subtitle="Secure access for medical professionals"
        />

        <AuthCard>
          <StyledInput
            label="Email Address"
            icon="mail-outline"
            placeholder="name@hospital.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <StyledInput
            label="Password"
            icon="lock-closed-outline"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            rightAction={{
              text: "Forgot Password?",
              onPress: () => Alert.alert("Info", "Password reset coming soon"),
            }}
          />

          <StyledButton
            title={mutation.isLoading ? "Signing in..." : "Sign In"}
            onPress={handleLogin}
            loading={mutation.isLoading}
            disabled={mutation.isLoading}
          />
        </AuthCard>

        {/* Register New Entity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REGISTER NEW ENTITY</Text>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push("/(auth)/register")}
          >
            <View style={styles.optionIcon}>
              <Text style={styles.optionIconText}>🏥</Text>
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Hospital</Text>
              <Text style={styles.optionSubtitle}>
                Register your medical facility
              </Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push("/(auth)/register")}
          >
            <View style={styles.optionIcon}>
              <Text style={styles.optionIconText}>🩸</Text>
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Blood Bank</Text>
              <Text style={styles.optionSubtitle}>
                Manage donations and supply
              </Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push("/(auth)/accept-invite")}
          >
            <View style={styles.optionIcon}>
              <Text style={styles.optionIconText}>👨‍⚕️</Text>
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Doctor</Text>
              <Text style={styles.optionSubtitle}>
                Join as a verified professional
              </Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Support Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Need help? </Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Support", "Contact support coming soon")
            }
          >
            <Text style={styles.footerLink}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: "center",
  },
  section: {
    marginTop: spacing["2xl"],
  },
  sectionTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  optionIconText: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  optionArrow: {
    fontSize: 24,
    color: colors.textLight,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing["2xl"],
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
});
