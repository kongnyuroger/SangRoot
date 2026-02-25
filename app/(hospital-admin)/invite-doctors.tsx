import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, Input } from "../../src/components/ui";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../src/constants/theme";
import { inviteDoctor } from "../../src/services/hospital.service";

export default function InviteDoctorsScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastCode, setLastCode] = useState<string | null>(null);

  const handleInvite = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = (await inviteDoctor({ doctorEmail: email })) as any;
      setLastCode(res?.inviteCode ?? res?.code ?? null);
      Alert.alert(
        "Invite Sent",
        `An invite has been generated for ${email}.\n\nNote: Email delivery is not yet active — share the invite code manually.`,
      );
      setEmail("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to generate invite";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Invite Doctors</Text>
        <Text style={styles.pageSubtitle}>
          Generate invite codes for your medical team
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Notice */}
        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={styles.noticeText}>
            Email delivery is not yet active. Copy and share the generated
            invite code directly with the doctor.
          </Text>
        </View>

        <Card padding="lg">
          <Input
            label="Doctor's Email"
            icon="mail-outline"
            placeholder="doctor@hospital.com"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setError("");
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            error={error}
          />
          <Button
            title="Generate Invite"
            icon="send-outline"
            onPress={handleInvite}
            loading={isLoading}
            disabled={isLoading}
            size="lg"
          />
        </Card>

        {lastCode && (
          <Card padding="lg" variant="outlined">
            <Text style={styles.codeLabel}>Generated Invite Code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{lastCode}</Text>
              <Ionicons name="copy-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.codeHint}>
              Share this code with the doctor to complete registration.
            </Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  pageHeader: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pageTitle: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  pageSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  scrollContent: { padding: spacing["2xl"], gap: spacing.lg },
  notice: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: "flex-start",
  },
  noticeText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.primaryDark,
    lineHeight: 20,
  },
  codeLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  codeBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  codeText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  codeHint: { fontSize: typography.fontSize.xs, color: colors.textSecondary },
});
