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

export default function Onboarding1Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Hero gradient background strip */}
      <View style={styles.heroBg} />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Ionicons name="water" size={56} color={colors.white} />
        </View>

        {/* Headline */}
        <View style={styles.textBlock}>
          <Text style={styles.title}>Welcome to{"\n"}SangRoot</Text>
          <Text style={styles.subtitle}>
            The emergency blood network connecting hospitals, blood banks, and
            donors — when every second counts.
          </Text>
        </View>

        {/* Feature pills */}
        <View style={styles.pillsRow}>
          {["Hospitals", "Blood Banks", "Donors", "Doctors"].map((label) => (
            <View key={label} style={styles.pill}>
              <Text style={styles.pillText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom nav */}
      <View style={styles.footer}>
        {/* Progress dots */}
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={async () => {
              await setOnboardingCompleted();
              router.replace("/(auth)/login");
            }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => router.push("/(auth)/onboarding-2")}
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "55%",
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing["2xl"],
    paddingTop: spacing["5xl"],
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing["3xl"],
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  textBlock: {
    alignItems: "center",
    marginBottom: spacing["3xl"],
  },
  title: {
    fontSize: typography.fontSize["4xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    textAlign: "center",
    lineHeight: 42,
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing["4xl"],
  },
  pill: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  pillText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing["2xl"],
    paddingBottom: spacing["2xl"],
    gap: spacing.xl,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipText: {
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
