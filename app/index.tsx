import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoadingScreen } from "../src/components/ui";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../src/constants/theme";
import { useAuth } from "../src/context";
import { hasCompletedOnboarding } from "../src/lib/authStorage";

export default function RootScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isLoading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  // biome-ignore lint: correctness/useExhaustiveDependencies
  useEffect(() => {
    const check = async () => {
      const done = await hasCompletedOnboarding();
      if (!done) {
        router.replace("/(auth)/onboarding-1");
        return;
      }
      setCheckingOnboarding(false);
    };
    check();
  }, []);

  if (isLoading || checkingOnboarding) {
    return <LoadingScreen />;
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Top accent */}
      <View style={styles.topBar} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Ionicons name="water" size={32} color={colors.white} />
          </View>
          <Text style={styles.appName}>SangRoot</Text>
          <Text style={styles.tagline}>
            Choose your access type to continue
          </Text>
        </View>

        {/* Option cards */}
        <View style={styles.cards}>
          {/* Sign In — primary filled card */}
          <TouchableOpacity
            style={[styles.card, styles.cardPrimary]}
            activeOpacity={0.85}
            onPress={() => router.push("/(auth)/login")}
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

          {/* Register Organisation — outline card */}
          <TouchableOpacity
            style={[styles.card, styles.cardOutline]}
            activeOpacity={0.85}
            onPress={() => router.push("/(auth)/register")}
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

          {/* Accept Doctor Invite — outline card */}
          <TouchableOpacity
            style={[styles.card, styles.cardOutline]}
            activeOpacity={0.85}
            onPress={() => router.push("/(auth)/accept-invite")}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    height: 4,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing["2xl"],
    justifyContent: "center",
    gap: spacing["3xl"],
  },
  header: { alignItems: "center", gap: spacing.md },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  tagline: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
  cards: { gap: spacing.md },
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
});
