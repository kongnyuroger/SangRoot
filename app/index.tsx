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

const options = [
  {
    icon: "business-outline" as const,
    title: "Hospital",
    description: "Manage donors, doctors & blood requests",
    route: "/(auth)/login" as const,
  },
  {
    icon: "water-outline" as const,
    title: "Blood Bank",
    description: "Manage supply & respond to requests",
    route: "/(auth)/login" as const,
  },
  {
    icon: "medical-outline" as const,
    title: "Doctor",
    description: "Request blood & register donors",
    route: "/(auth)/accept-invite" as const,
  },
];

export default function RootScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuth();
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
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.title}
              style={styles.card}
              onPress={() => router.push(opt.route)}
              activeOpacity={0.8}
            >
              <View style={styles.cardIcon}>
                <Ionicons name={opt.icon} size={26} color={colors.primary} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{opt.title}</Text>
                <Text style={styles.cardDesc}>{opt.description}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.border}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Register section */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>New organisation? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.registerLink}>Register here</Text>
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    gap: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  registerLink: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});
