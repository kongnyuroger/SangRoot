import type React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
  View,
} from "react-native";
import { borderRadius, colors, shadows, spacing } from "../../constants/theme";

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  onPress?: () => void;
}

export function Card({
  children,
  variant = "default",
  padding = "md",
  onPress,
  style,
  ...rest
}: CardProps) {
  const paddingMap = {
    none: 0,
    sm: spacing.md,
    md: spacing.xl,
    lg: spacing["2xl"],
  };

  const content = (
    <View
      style={[
        styles.base,
        styles[variant],
        { padding: paddingMap[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} {...rest}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
  },
  default: {
    ...shadows.md,
  },
  elevated: {
    ...shadows.lg,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
});
