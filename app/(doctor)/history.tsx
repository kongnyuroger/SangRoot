import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "../../src/components/ui";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../src/constants/theme";
import api, { safeRequest } from "../../src/lib/api";

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

interface BloodRequestHistory {
  id: string;
  bloodGroup: string;
  unitsRequired: number;
  urgency: string;
  status: string;
  hospitalName: string;
  patientName: string;
  requiredBy: string;
  createdAt: string;
}

const REVERSE_BLOOD_GROUP_MAP: Record<string, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
};

const URGENCY_STYLES: Record<string, { label: string; color: string }> = {
  CRITICAL: { label: "Critical", color: colors.alertRed },
  URGENT: { label: "Urgent", color: colors.warning },
  ROUTINE: { label: "Routine", color: colors.successGreen },
};

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: colors.textSecondary },
  IN_PROGRESS: { label: "In Progress", color: colors.info },
  FULFILLED: { label: "Fulfilled", color: colors.successGreen },
  EXPIRED: { label: "Expired", color: colors.alertRed },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DoctorHistoryScreen() {
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState<BloodRequestHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await safeRequest(
        api.get("blood-requests").json<BloodRequestHistory[]>(),
      );
      if (data) setRequests(data);
    } catch (err) {
      // Error handling can be silent for history, or display generic error state
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [fetchHistory]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const renderItem = ({ item }: { item: BloodRequestHistory }) => {
    const bgDisplay =
      REVERSE_BLOOD_GROUP_MAP[item.bloodGroup] || item.bloodGroup;
    const urgency = URGENCY_STYLES[item.urgency] || {
      label: item.urgency,
      color: colors.textSecondary,
    };
    const status = STATUS_STYLES[item.status] || {
      label: item.status,
      color: colors.textSecondary,
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.patientRow}>
            <Ionicons
              name="person-circle-outline"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={styles.patientName}>
              {item.patientName || "Unknown Patient"}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${status.color}15` },
            ]}
          >
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.bgContainer}>
            <Text style={styles.bgText}>{bgDisplay}</Text>
            <Text style={styles.unitsText}>{item.unitsRequired} unit(s)</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons
                name="business-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.detailText} numberOfLines={1}>
                {item.hospitalName}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons
                name="warning-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={[styles.detailText, { color: urgency.color }]}>
                {urgency.label} Urgency
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.detailText}>
                Req by {formatDate(item.requiredBy)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            Created on {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Request History</Text>
        <Text style={styles.pageSubtitle}>Your past blood requests</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={
            requests.length === 0 ? styles.emptyContainer : styles.listContent
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="time-outline"
              title="No Requests Yet"
              description="Blood requests you raise will appear here."
            />
          }
        />
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  pageHeader: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pageTitle: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  pageSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  // Card Styles
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  patientName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  cardBody: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.md,
    alignItems: "center",
  },
  bgContainer: {
    width: 64,
    height: 64,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  bgText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryDark,
  },
  unitsText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryDark,
    marginTop: 2,
  },
  detailsContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  detailText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
  },
});
