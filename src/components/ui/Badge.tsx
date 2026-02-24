import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../constants/theme";

type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
type StatusVariant = "success" | "warning" | "error" | "info" | "default";

interface BadgeProps {
  label: string;
  variant?: StatusVariant;
  bloodGroup?: boolean;
}

const statusColors: Record<StatusVariant, { bg: string; text: string }> = {
  success: { bg: "#E8F5E9", text: colors.successGreen },
  warning: { bg: "#FFF8E1", text: "#F57F17" },
  error: { bg: "#FFEBEE", text: colors.alertRed },
  info: { bg: "#E3F2FD", text: colors.info },
  default: { bg: colors.lightGray, text: colors.neutralGray },
};

export function Badge({
  label,
  variant = "default",
  bloodGroup = false,
}: BadgeProps) {
  const { bg, text } = statusColors[variant];

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: bloodGroup ? colors.primaryLight : bg },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: bloodGroup ? colors.primaryDark : text },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.3,
  },
});
