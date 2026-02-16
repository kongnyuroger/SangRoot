import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { StyledButton } from "../../src/components/auth/StyledButton";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../src/constants/theme";

export default function Onboarding2Screen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="medical" size={64} color={colors.primary} />
        </View>

        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Manage Blood Requests</Text>
          <Text style={styles.description}>
            Doctors can easily request blood units and hospitals can manage
            inventory efficiently.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <StyledButton
            title="Next"
            onPress={() => router.push("/(auth)/onboarding-3")}
          />
          <View style={styles.buttonSpacer} />
          <StyledButton
            title="Back"
            onPress={() => router.back()}
            variant="outline"
          />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing["3xl"],
  },
  textContainer: {
    marginBottom: spacing["4xl"],
    alignItems: "center",
  },
  title: {
    fontSize: typography.fontSize["4xl"],
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: typography.fontSize.base,
    textAlign: "center",
    color: colors.textSecondary,
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  buttonContainer: {
    width: "100%",
    marginTop: spacing.xl,
  },
  buttonSpacer: {
    height: spacing.md,
  },
  progressContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing["2xl"],
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
});
