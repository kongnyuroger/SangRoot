import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { AuthCard } from "../../src/components/auth/AuthCard";
import { AuthHeader } from "../../src/components/auth/AuthHeader";
import { StyledButton } from "../../src/components/auth/StyledButton";
import { StyledInput } from "../../src/components/auth/StyledInput";
import { colors, spacing } from "../../src/constants/theme";
import { useLogin } from "../../src/hooks/useAuthHooks";

export default function BloodBankAdminLoginScreen() {
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
      router.replace("/(blood-bank-admin)/register-donor");
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
          icon="water-outline"
          title="Blood Bank Admin"
          subtitle="Manage donations and supply"
        />

        <AuthCard>
          <StyledInput
            label="Email Address"
            icon="mail-outline"
            placeholder="admin@bloodbank.com"
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
          />

          <StyledButton
            title={mutation.isLoading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            loading={mutation.isLoading}
            disabled={mutation.isLoading}
          />

          <View style={styles.divider} />

          <StyledButton
            title="Back to Main Login"
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
  divider: {
    height: spacing.md,
  },
});
