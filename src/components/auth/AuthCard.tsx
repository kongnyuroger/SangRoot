import type React from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { borderRadius, colors, shadows, spacing } from "../../constants/theme";

interface AuthCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing["2xl"],
    ...shadows.md,
  },
});
