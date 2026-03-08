import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import { useRegister } from "../../src/hooks/useAuthHooks";

type OrgRole = "HOSPITAL" | "BLOOD_BANK";

const roleOptions: {
  value: OrgRole;
  label: string;
  icon: string;
  desc: string;
}[] = [
  {
    value: "HOSPITAL",
    label: "Hospital",
    icon: "🏥",
    desc: "Register as hospital administrator",
  },
  {
    value: "BLOOD_BANK",
    label: "Blood Bank",
    icon: "🩸",
    desc: "Manage donations and blood supply",
  },
];

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { refreshUser } = useAuth();
  const mutation = useRegister();

  const [role, setRole] = useState<OrgRole>("HOSPITAL");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Minimum 8 characters";
    if (confirmPassword !== password)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      await mutation.mutateAsync({ email, password, role });
      await refreshUser();
      // Guard in _layout.tsx will redirect to complete-profile
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Registration failed";
      Alert.alert("Registration Error", msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View
          style={[styles.headerStrip, { paddingTop: insets.top + spacing.xl }]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Register</Text>
          <Text style={styles.headerSubtitle}>
            Create your organisation account
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card padding="lg" style={styles.formCard}>
            {/* Role selector */}
            <Text style={styles.roleLabel}>Organisation Type</Text>
            <View style={styles.roleRow}>
              {roleOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.roleChip,
                    role === opt.value && styles.roleChipActive,
                  ]}
                  onPress={() => setRole(opt.value)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.roleEmoji}>{opt.icon}</Text>
                  <View>
                    <Text
                      style={[
                        styles.roleChipLabel,
                        role === opt.value && styles.roleChipLabelActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text style={styles.roleChipDesc}>{opt.desc}</Text>
                  </View>
                  {role === opt.value && (
                    <View style={styles.checkmark}>
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={colors.white}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Email Address"
              icon="mail-outline"
              placeholder="admin@hospital.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email}
            />
            <Input
              label="Password"
              icon="lock-closed-outline"
              placeholder="Min. 8 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              secureToggle
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              icon="shield-checkmark-outline"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              secureToggle
              error={errors.confirmPassword}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={mutation.isLoading}
              disabled={mutation.isLoading}
              size="lg"
              style={styles.submitBtn}
            />
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
  roleLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  roleRow: { gap: spacing.md, marginBottom: spacing.xl },
  roleChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  roleChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  roleEmoji: { fontSize: 22 },
  roleChipLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  roleChipLabelActive: { color: colors.primaryDark },
  roleChipDesc: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  checkmark: {
    marginLeft: "auto",
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtn: { marginTop: spacing.md },
  footer: { flexDirection: "row", justifyContent: "center" },
  footerText: { fontSize: typography.fontSize.sm, color: colors.textSecondary },
  footerLink: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});
