import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { api, safeRequest } from "../../src/lib/api";

const quickActions = [
  {
    label: "Register Donor",
    icon: "person-add-outline" as const,
    route: "./register-donor",
  },
  {
    label: "Invite Doctor",
    icon: "stethoscope" as const,
    iconSet: "material" as const,
    route: "./invite-doctors",
  },
  {
    label: "Blood Requests",
    icon: "water-outline" as const,
    route: "./blood-requests",
  },
  { label: "Settings", icon: "settings-outline" as const, route: "./settings" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function AppIcon({
  name,
  iconSet,
  size,
  color,
}: {
  name: string;
  iconSet?: "material";
  size: number;
  color: string;
}) {
  if (iconSet === "material") {
    return (
      <MaterialCommunityIcons name={name as any} size={size} color={color} />
    );
  }
  return <Ionicons name={name as any} size={size} color={color} />;
}

type StatsData = {
  doctors: number;
  donors: number;
  requests: number;
};

export default function HospitalAdminHome() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [statsData, setStatsData] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await safeRequest(
          api.get("hospitals/stats").json<StatsData>(),
        );
        setStatsData(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  const displayStats = [
    {
      label: "Donors",
      value: statsData ? statsData.donors.toString() : "—",
      icon: "people-outline" as const,
      color: colors.primary,
    },
    {
      label: "Doctors",
      value: statsData ? statsData.doctors.toString() : "—",
      icon: "stethoscope" as const,
      iconSet: "material" as const,
      color: "#3B82F6",
    },
    {
      label: "Requests",
      value: statsData ? statsData.requests.toString() : "—",
      icon: "water-outline" as const,
      color: colors.alertRed,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.orgName} numberOfLines={1}>
            {user?.profile?.name ?? "Hospital Admin"}
          </Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="business" size={24} color={colors.primary} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats row */}
        <View style={styles.statsRow}>
          {displayStats.map((s) => (
            <Card key={s.label} style={styles.statCard} padding="md">
              <View
                style={[styles.statIcon, { backgroundColor: `${s.color}18` }]}
              >
                <AppIcon
                  name={s.icon}
                  iconSet={s.iconSet}
                  size={20}
                  color={s.color}
                />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.8}
            >
              <View style={styles.actionIcon}>
                <AppIcon
                  name={action.icon}
                  iconSet={action.iconSet}
                  size={26}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activity placeholder */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card padding="lg">
          <View style={styles.emptyActivity}>
            <Ionicons name="time-outline" size={32} color={colors.border} />
            <Text style={styles.emptyText}>Activity feed coming soon</Text>
          </View>
        </Card>
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
  orgName: {
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
  scrollContent: {
    padding: spacing["2xl"],
    gap: spacing.xl,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: spacing.sm,
  },
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
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  actionCard: {
    width: "47%",
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
  emptyActivity: {
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
  },
});
