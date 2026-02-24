import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "../../src/components/ui";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../src/constants/theme";
import { useAuth } from "../../src/context";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DoctorHome() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.name} numberOfLines={1}>
            Dr. {user?.profile?.name ?? "Doctor"}
          </Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="medical" size={22} color={colors.primary} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency CTA */}
        <TouchableOpacity
          style={styles.emergencyCard}
          onPress={() => router.push("./request")}
          activeOpacity={0.88}
        >
          <View style={styles.emergencyLeft}>
            <Text style={styles.emergencyLabel}>EMERGENCY</Text>
            <Text style={styles.emergencyTitle}>Request Blood Now</Text>
            <Text style={styles.emergencyDesc}>
              Raise an urgent blood request for your patient
            </Text>
          </View>
          <View style={styles.emergencyIcon}>
            <Ionicons name="water" size={36} color={colors.white} />
          </View>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            {
              label: "Requests Raised",
              value: "—",
              icon: "water-outline" as const,
              color: colors.primary,
            },
            {
              label: "Fulfilled",
              value: "—",
              icon: "checkmark-circle-outline" as const,
              color: colors.successGreen,
            },
          ].map((s) => (
            <Card key={s.label} style={styles.statCard} padding="md">
              <View
                style={[styles.statIcon, { backgroundColor: `${s.color}18` }]}
              >
                <Ionicons name={s.icon} size={20} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {[
            {
              label: "Blood Request",
              icon: "water-outline" as const,
              route: "./request",
            },
            {
              label: "History",
              icon: "time-outline" as const,
              route: "./history",
            },
          ].map((a) => (
            <TouchableOpacity
              key={a.label}
              style={styles.actionCard}
              onPress={() => router.push(a.route as any)}
              activeOpacity={0.8}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={a.icon} size={26} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: { fontSize: typography.fontSize.sm, color: colors.textSecondary },
  name: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    maxWidth: 240,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { padding: spacing["2xl"], gap: spacing.xl },
  emergencyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing["2xl"],
    overflow: "hidden",
  },
  emergencyLeft: { flex: 1 },
  emergencyLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  emergencyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  emergencyDesc: {
    fontSize: typography.fontSize.sm,
    color: "rgba(255,255,255,0.8)",
  },
  emergencyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: { flexDirection: "row", gap: spacing.md },
  statCard: { flex: 1, alignItems: "center", gap: spacing.sm },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  actionsRow: { flexDirection: "row", gap: spacing.md },
  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    textAlign: "center",
  },
});
