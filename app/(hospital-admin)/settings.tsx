import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card } from "../../src/components/ui";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../src/constants/theme";
import { useAuth } from "../../src/context";

export default function HospitalSettingsScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  const profile = user?.profile;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Settings</Text>
        <Text style={styles.pageSubtitle}>Manage your hospital account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile card */}
        <Card padding="lg">
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Ionicons name="business" size={28} color={colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profile?.name ?? "Hospital"}
              </Text>
              <Text style={styles.profileEmail}>{profile?.email ?? ""}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>🏥 Hospital Admin</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Details */}
        <Card padding="lg">
          <Text style={styles.sectionLabel}>Organisation Details</Text>
          {[
            {
              label: "Phone",
              value: profile?.phone,
              icon: "call-outline" as const,
            },
            {
              label: "Region",
              value: (profile?.region as string)?.replace("_", " "),
              icon: "map-outline" as const,
            },
            {
              label: "Town",
              value: profile?.town,
              icon: "navigate-outline" as const,
            },
            {
              label: "Area",
              value: profile?.neighbourhood,
              icon: "pin-outline" as const,
            },
            {
              label: "Address",
              value: profile?.address,
              icon: "location-outline" as const,
            },
            {
              label: "License",
              value: profile?.licenseNumber,
              icon: "document-text-outline" as const,
            },
          ].map((item) => (
            <View key={item.label} style={styles.detailRow}>
              <Ionicons name={item.icon} size={16} color={colors.neutralGray} />
              <Text style={styles.detailLabel}>{item.label}:</Text>
              <Text style={styles.detailValue}>
                {(item.value as string) ?? "—"}
              </Text>
            </View>
          ))}
        </Card>

        {/* Actions */}
        <Card padding="lg" variant="outlined">
          <Text style={styles.sectionLabel}>Account</Text>
          <Button
            title="Sign Out"
            icon="log-out-outline"
            onPress={handleLogout}
          />
        </Card>

        <Text style={styles.version}>SangRoot v1.0 · Hospital Edition</Text>
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
  profileRow: { flexDirection: "row", gap: spacing.lg, alignItems: "center" },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: { flex: 1, gap: spacing.sm },
  profileName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  roleText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primaryDark,
  },
  sectionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    width: 64,
  },
  detailValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    flex: 1,
  },
  version: {
    textAlign: "center",
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    marginTop: spacing.sm,
  },
});
