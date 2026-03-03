import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, Input } from "../../src/components/ui";
import { colors, spacing, typography } from "../../src/constants/theme";
import { inviteDoctor } from "../../src/services/hospital.service";

export default function InviteDoctorsScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastInviteId, setLastInviteId] = useState<string | null>(null);

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
      // API returns { id, doctorEmail, status, createdAt }
      const inviteId: string = res?.id ?? res?.inviteCode ?? res?.code ?? "";
      setLastInviteId(inviteId);
      Alert.alert(
        "Invite Sent ✉️",
        `An invitation email has been sent to ${email}.\n\nThe doctor should check their inbox and use the invite code to complete registration.`,
      );
      setEmail("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to send invite";
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
          Send email invitations to your medical team
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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
            title="Send Invite"
            icon="send-outline"
            onPress={handleInvite}
            loading={isLoading}
            disabled={isLoading}
            size="lg"
          />
        </Card>

        {lastInviteId && (
          <Card padding="lg" variant="outlined">
            <View style={styles.successHeader}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.successGreen}
              />
              <Text style={styles.codeLabel}>Invite Email Sent</Text>
            </View>
            <Text style={styles.codeHint}>
              The invitation has been emailed to the doctor. The invite ID below
              is for your reference.
            </Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText} numberOfLines={1}>
                {lastInviteId}
              </Text>
              <Ionicons name="copy-outline" size={20} color={colors.primary} />
            </View>
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
    borderRadius: 8,
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
  successHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
});
