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

export default function Onboarding3Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleGetStarted = async (
    path: "/(auth)/login" | "/(auth)/register" | "/(auth)/accept-invite",
  ) => {
    await setOnboardingCompleted();
    router.replace(path);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconWrap}>
          <Ionicons name="heart" size={48} color={colors.primary} />
        </View>

        <Text style={styles.title}>Join the{"\n"}Emergency Network</Text>
        <Text style={styles.subtitle}>
          Choose how you want to be part of SangRoot's life-saving platform.
        </Text>

        {/* CTA cards */}
        <View style={styles.cards}>
          <TouchableOpacity
            style={[styles.card, styles.cardPrimary]}
            activeOpacity={0.85}
            onPress={() => handleGetStarted("/(auth)/login")}
          >
            <Ionicons name="log-in-outline" size={22} color={colors.white} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitleWhite}>Sign In</Text>
              <Text style={styles.cardDescWhite}>Already have an account</Text>
            </View>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="rgba(255,255,255,0.7)"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardOutline]}
            activeOpacity={0.85}
            onPress={() => handleGetStarted("/(auth)/register")}
          >
            <Ionicons
              name="business-outline"
              size={22}
              color={colors.primary}
            />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Register Organisation</Text>
              <Text style={styles.cardDesc}>Hospital or Blood Bank</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.border} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.cardOutline]}
            activeOpacity={0.85}
            onPress={() => handleGetStarted("/(auth)/accept-invite")}
          >
            <Ionicons
              name="mail-open-outline"
              size={22}
              color={colors.primary}
            />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Accept Doctor Invite</Text>
              <Text style={styles.cardDesc}>Enter your invite code</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.border} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress dots */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
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
    paddingTop: spacing["5xl"],
    alignItems: "center",
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing["3xl"],
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 38,
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing["4xl"],
  },
  cards: {
    width: "100%",
    gap: spacing.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  cardPrimary: {
    backgroundColor: colors.primary,
  },
  cardOutline: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardText: { flex: 1 },
  cardTitleWhite: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: 2,
  },
  cardDescWhite: {
    fontSize: typography.fontSize.sm,
    color: "rgba(255,255,255,0.75)",
  },
  cardTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  footer: { paddingBottom: spacing["3xl"] },
  dots: { flexDirection: "row", justifyContent: "center", gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 24, backgroundColor: colors.primary },
});
