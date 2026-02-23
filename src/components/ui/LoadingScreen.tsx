import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../constants/theme";

export function LoadingScreen({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="water" size={48} color={colors.primary} />
      </View>
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spinner}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    gap: spacing.lg,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    marginTop: spacing.sm,
  },
  message: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});
