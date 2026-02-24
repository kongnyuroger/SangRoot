import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, Input } from "../../src/components/ui";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../src/constants/theme";
import { useAuth } from "../../src/context";
import { useLogin } from "../../src/hooks/useAuthHooks";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { refreshUser } = useAuth();
  const mutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await mutation.mutateAsync({ email, password });
      await refreshUser();
      // Navigation guard in _layout.tsx handles routing after refreshUser
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed";
      setErrors({ password: msg });
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header strip */}
      <View
        style={[styles.headerStrip, { paddingTop: insets.top + spacing.xl }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign In</Text>
        <Text style={styles.headerSubtitle}>Welcome back to SangRoot</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Card padding="lg" style={styles.formCard}>
          <Input
            label="Email Address"
            icon="mail-outline"
            placeholder="name@hospital.com"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email}
          />

          <Input
            label="Password"
            icon="lock-closed-outline"
            placeholder="••••••••"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (errors.password)
                setErrors((p) => ({ ...p, password: undefined }));
            }}
            secureTextEntry
            secureToggle
            error={errors.password}
            rightAction={{
              text: "Forgot?",
              onPress: () => Alert.alert("Info", "Password reset coming soon"),
            }}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={mutation.isLoading}
            disabled={mutation.isLoading}
            size="lg"
            style={styles.submitBtn}
          />
        </Card>

        {/* Register section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DON'T HAVE AN ACCOUNT?</Text>
          <Button
            title="Register Organisation"
            variant="outline"
            icon="business-outline"
            onPress={() => router.push("/(auth)/register")}
          />
          <Button
            title="Accept Doctor Invite"
            variant="ghost"
            icon="mail-open-outline"
            onPress={() => router.push("/(auth)/accept-invite")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerStrip: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing["2xl"],
    paddingBottom: spacing["3xl"],
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backBtn: { marginBottom: spacing.xl },
  backText: {
    fontSize: typography.fontSize.sm,
    color: "rgba(255,255,255,0.8)",
    fontWeight: typography.fontWeight.medium,
  },
  headerTitle: {
    fontSize: typography.fontSize["4xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.base,
    color: "rgba(255,255,255,0.75)",
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing["2xl"],
    paddingTop: spacing["3xl"],
    gap: spacing["2xl"],
  },
  formCard: { marginTop: -spacing["4xl"] },
  submitBtn: { marginTop: spacing.md },
  section: { gap: spacing.md },
  sectionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
    letterSpacing: 1,
    textAlign: "center",
  },
});
