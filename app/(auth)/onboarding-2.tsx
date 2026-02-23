import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../src/constants/theme";
import { setOnboardingCompleted } from "../../src/lib/authStorage";

const steps = [
  {
    icon: "business-outline" as const,
    color: colors.primary,
    bg: colors.primaryLight,
    title: "Hospital Creates Request",
    description:
      "A doctor raises an emergency blood request from within the app.",
  },
  {
    icon: "water-outline" as const,
    color: "#3B82F6",
    bg: "#DBEAFE",
    title: "Blood Banks Respond",
    description:
      "Nearby blood banks are instantly notified and confirm availability.",
  },
  {
    icon: "person-outline" as const,
    color: colors.successGreen,
    bg: "#DCFCE7",
    title: "Donors Are Mobilised",
    description:
      "Registered donors in the area receive alerts to donate immediately.",
  },
];

export default function Onboarding2Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.eyebrow}>HOW IT WORKS</Text>
        <Text style={styles.title}>From Request to{"\n"}Rescue in Minutes</Text>

        <View style={styles.stepsContainer}>
          {steps.map((step, idx) => (
            <View key={step.title} style={styles.stepRow}>
              <View style={styles.stepLeft}>
                <View style={[styles.iconCircle, { backgroundColor: step.bg }]}>
                  <Ionicons name={step.icon} size={26} color={step.color} />
                </View>
                {idx < steps.length - 1 && <View style={styles.connector} />}
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepNumber}>Step {idx + 1}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* AI badge */}
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={16} color={colors.primary} />
          <Text style={styles.aiText}>
            AI agents will automate donor outreach — coming soon
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => router.push("/(auth)/onboarding-3")}
            activeOpacity={0.85}
          >
            <Text style={styles.nextText}>Next</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    paddingHorizontal: spacing["2xl"],
    paddingTop: spacing["4xl"],
  },
  eyebrow: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: 36,
    marginBottom: spacing["3xl"],
  },
  stepsContainer: { gap: 0 },
  stepRow: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  stepLeft: {
    alignItems: "center",
    width: 56,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
    minHeight: 24,
  },
  stepContent: {
    flex: 1,
    paddingBottom: spacing["2xl"],
    paddingTop: spacing.sm,
  },
  stepNumber: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  stepTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  stepDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignSelf: "flex-start",
    marginTop: spacing.lg,
  },
  aiText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.primaryDark,
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing["2xl"],
    paddingBottom: spacing["2xl"],
    gap: spacing.xl,
  },
  dots: { flexDirection: "row", justifyContent: "center", gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 24, backgroundColor: colors.primary },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing["2xl"],
    borderRadius: borderRadius.full,
  },
  nextText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.white,
  },
});
