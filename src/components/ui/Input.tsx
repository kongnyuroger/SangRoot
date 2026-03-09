import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
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

interface InputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  rightAction?: { text: string; onPress: () => void };
  secureToggle?: boolean;
}

export function Input({
  label,
  icon,
  error,
  rightAction,
  secureToggle,
  secureTextEntry,
  style,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {rightAction && (
            <TouchableOpacity onPress={rightAction.onPress}>
              <Text style={styles.rightActionText}>{rightAction.text}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* pointerEvents="box-none" lets touches pass through the View shell
          directly to the TextInput child, preventing the wrapper from
          absorbing the tap before the keyboard can open on Android */}
      <View
        pointerEvents="box-none"
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error ? styles.inputWrapperError : null,
        ]}
        onTouchStart={() => inputRef.current?.focus()}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={isFocused ? colors.primary : colors.textLight}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          ref={inputRef}
          style={[styles.input, style]}
          placeholderTextColor={colors.textLight}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          textContentType={isSecure ? "none" : undefined}
          autoComplete={isSecure ? "off" : undefined}
          {...rest}
        />
        {secureToggle && (
          <TouchableOpacity
            onPress={() => setIsSecure((prev) => !prev)}
            style={styles.rightIcon}
          >
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={colors.textLight}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

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
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  rightActionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: colors.alertRed,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  rightIcon: {
    padding: spacing.sm,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.alertRed,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
