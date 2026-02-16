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
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../src/constants/theme";
import { useRegister } from "../../src/hooks/useAuthHooks";

type UserRole = "DOCTOR" | "HOSPITAL" | "BLOOD_BANK";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null);
  const mutation = useRegister();

  const roles: {
    value: UserRole;
    label: string;
    description: string;
    icon: string;
  }[] = [
    {
      value: "HOSPITAL",
      label: "Hospital",
      description: "Register as a hospital administrator",
      icon: "🏥",
    },
    {
      value: "BLOOD_BANK",
      label: "Blood Bank",
      description: "Register as a blood bank administrator",
      icon: "🩸",
    },
  ];

  const handleRegister = async () => {
    if (!selectedRole) {
      Alert.alert("Role Required", "Please select a role");
      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert("Required Fields", "Please fill in all fields");
      return;
    }

    try {
      await mutation.mutateAsync({ email, password, role: selectedRole });
      // after register, go to complete profile with role parameter
      router.push({
        pathname: "/(auth)/complete-profile",
        params: { role: selectedRole },
      });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      Alert.alert("Registration failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          icon="person-add-outline"
          title="Create Account"
          subtitle="Register your organization"
        />

        <AuthCard>
          {/* Role Selection */}
          <View style={styles.roleSection}>
            <Text style={styles.roleLabel}>Select Your Role</Text>
            <View style={styles.roleOptions}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.value}
                  onPress={() => setSelectedRole(role.value)}
                  style={[
                    styles.roleCard,
                    selectedRole === role.value && styles.roleCardSelected,
                  ]}
                >
                  <View style={styles.roleIconContainer}>
                    <Text style={styles.roleIcon}>{role.icon}</Text>
                  </View>
                  <View style={styles.roleContent}>
                    <Text
                      style={[
                        styles.roleTitle,
                        selectedRole === role.value && styles.roleTitleSelected,
                      ]}
                    >
                      {role.label}
                    </Text>
                    <Text style={styles.roleDescription}>
                      {role.description}
                    </Text>
                  </View>
                  {selectedRole === role.value && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <StyledButton
            title={mutation.isLoading ? "Creating Account..." : "Register"}
            onPress={handleRegister}
            loading={mutation.isLoading}
            disabled={mutation.isLoading || !selectedRole}
          />

          <View style={styles.divider} />

          <StyledButton
            title="Back to Login"
            onPress={() => router.push("/(auth)/login")}
            variant="outline"
          />
        </AuthCard>
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
  roleSection: {
    marginBottom: spacing.xl,
  },
  roleLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  roleOptions: {
    gap: spacing.md,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  roleIcon: {
    fontSize: 24,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  roleTitleSelected: {
    color: colors.primary,
  },
  roleDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  divider: {
    height: spacing.lg,
  },
});
