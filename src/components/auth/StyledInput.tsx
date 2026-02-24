import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../constants/theme";

interface StyledInputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  rightAction?: {
    text: string;
    onPress: () => void;
  };
}

export const StyledInput: React.FC<StyledInputProps> = ({
  label,
  icon,
  error,
  rightAction,
  secureTextEntry,
  ...textInputProps
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry === true;
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      {/* Label Row */}
      {(label || rightAction) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {rightAction && (
            <TouchableOpacity onPress={rightAction.onPress}>
              <Text style={styles.rightActionText}>{rightAction.text}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Input Container */}
      <View
        pointerEvents="box-none"
        onTouchStart={() => inputRef.current?.focus()}
        style={[styles.inputContainer, error && styles.inputContainerError]}
      >
        {/* Icon */}
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={20} color={colors.textSecondary} />
          </View>
        )}

        {/* Text Input */}
        <TextInput
          ref={inputRef}
          style={[styles.input, icon && styles.inputWithIcon]}
          placeholderTextColor={colors.textLight}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...textInputProps}
        />

        {/* Password Toggle */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.passwordToggle}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  rightActionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputContainerError: {
    borderColor: colors.alertRed,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  passwordToggle: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.alertRed,
    marginTop: spacing.xs,
  },
});
