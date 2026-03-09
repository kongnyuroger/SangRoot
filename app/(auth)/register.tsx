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
import { Button, Input } from "../../src/components/ui";
import { colors, spacing, typography } from "../../src/constants/theme";
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
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── HEADER (scrolls with content) ── */}
          <View
            style={[styles.topSection, { paddingTop: insets.top + spacing.md }]}
          >
            <View style={styles.blobTopRight} />
            <View style={styles.blobBottomLeft} />

            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.logoMark}>
              <Text style={styles.logoEmoji}>🏢</Text>
            </View>

            <Text style={styles.heading}>
              Register Org<Text style={styles.headingAccent}>.</Text>
            </Text>
            <Text style={styles.subheading}>
              Create your organisation account
            </Text>
          </View>

          {/* ── FORM ── */}
          <View style={styles.formContent}>
            {/* Role selector */}
            <Text style={styles.roleLabel}>Organisation Type</Text>
            <View style={styles.roleGrid}>
              {roleOptions.map((opt) => {
                const active = role === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.roleCard, active && styles.roleCardActive]}
                    onPress={() => setRole(opt.value)}
                    activeOpacity={0.8}
                  >
                    {active && (
                      <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={11} color="#fff" />
                      </View>
                    )}
                    <Text style={styles.roleIcon}>{opt.icon}</Text>
                    <Text
                      style={[
                        styles.roleCardName,
                        active && styles.roleCardNameActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text style={styles.roleCardDesc}>{opt.desc}</Text>
                  </TouchableOpacity>
                );
              })}
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

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const ORANGE = "#F05A28";

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: "#F7F7F8" },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  /* ── HEADER ── */
  topSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing["2xl"],
    paddingBottom: spacing["2xl"],
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  blobTopRight: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(240,90,40,0.09)",
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(240,90,40,0.06)",
  },

  backBtn: { marginBottom: spacing.lg },
  backText: {
    fontSize: typography.fontSize.sm,
    color: "#8A8A9A",
    fontWeight: typography.fontWeight.medium,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  logoEmoji: { fontSize: 20 },
  heading: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1A1A2E",
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: spacing.xs,
  },
  headingAccent: { color: ORANGE },
  subheading: { fontSize: typography.fontSize.sm, color: "#8A8A9A" },

  /* ── FORM ── */
  formContent: {
    padding: spacing["2xl"],
    gap: spacing.lg,
    paddingBottom: spacing["3xl"],
  },

  /* Role selector */
  roleLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: "#1A1A2E",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: -spacing.xs,
  },
  roleGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  roleCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E8E8F0",
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.xs,
    position: "relative",
  },
  roleCardActive: {
    borderColor: ORANGE,
    backgroundColor: "#FFF1EB",
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  checkBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  roleIcon: { fontSize: 22, marginBottom: 2 },
  roleCardName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: "#1A1A2E",
  },
  roleCardNameActive: { color: "#C04010" },
  roleCardDesc: {
    fontSize: typography.fontSize.xs,
    color: "#8A8A9A",
    lineHeight: 16,
  },

  submitBtn: { marginTop: spacing.sm },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { fontSize: typography.fontSize.sm, color: "#8A8A9A" },
  footerLink: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: ORANGE,
  },
});
