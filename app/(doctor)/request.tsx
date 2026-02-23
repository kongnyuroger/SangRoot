import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, Input } from "../../src/components/ui";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../src/constants/theme";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const URGENCY_LEVELS = [
  {
    value: "CRITICAL",
    label: "Critical",
    desc: "Immediate (< 1h)",
    color: colors.alertRed,
  },
  {
    value: "URGENT",
    label: "Urgent",
    desc: "Within 3 hours",
    color: "#F59E0B",
  },
  {
    value: "NORMAL",
    label: "Normal",
    desc: "Within 24 hours",
    color: colors.successGreen,
  },
];

export default function DoctorRequestScreen() {
  const insets = useSafeAreaInsets();
  const [bloodGroup, setBloodGroup] = useState("");
  const [urgency, setUrgency] = useState("URGENT");
  const [units, setUnits] = useState("1");
  const [notes, setNotes] = useState("");

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Blood Request</Text>
        <Text style={styles.pageSubtitle}>
          Raise an emergency blood request
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Coming soon banner */}
        <View style={styles.comingSoonBanner}>
          <Ionicons name="construct-outline" size={18} color={colors.primary} />
          <Text style={styles.comingSoonText}>
            Blood request submission is coming soon. You can preview the form
            below.
          </Text>
        </View>

        <Card padding="lg">
          <Text style={styles.sectionLabel}>Blood Group Needed *</Text>
          <View style={styles.bgGrid}>
            {BLOOD_GROUPS.map((bg) => (
              <TouchableOpacity
                key={bg}
                style={[
                  styles.bgChip,
                  bloodGroup === bg && styles.bgChipActive,
                ]}
                onPress={() => setBloodGroup(bg)}
              >
                <Text
                  style={[
                    styles.bgText,
                    bloodGroup === bg && styles.bgTextActive,
                  ]}
                >
                  {bg}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card padding="lg">
          <Text style={styles.sectionLabel}>Urgency Level *</Text>
          <View style={styles.urgencyList}>
            {URGENCY_LEVELS.map((u) => (
              <TouchableOpacity
                key={u.value}
                style={[
                  styles.urgencyCard,
                  urgency === u.value && {
                    borderColor: u.color,
                    backgroundColor: `${u.color}12`,
                  },
                ]}
                onPress={() => setUrgency(u.value)}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.urgencyDot, { backgroundColor: u.color }]}
                />
                <View style={styles.urgencyText}>
                  <Text style={styles.urgencyLabel}>{u.label}</Text>
                  <Text style={styles.urgencyDesc}>{u.desc}</Text>
                </View>
                {urgency === u.value && (
                  <Ionicons name="checkmark-circle" size={20} color={u.color} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card padding="lg">
          <Input
            label="Units Required"
            icon="layers-outline"
            placeholder="e.g. 2"
            value={units}
            onChangeText={setUnits}
            keyboardType="numeric"
          />
          <Input
            label="Additional Notes"
            icon="document-text-outline"
            placeholder="Patient condition, ward number, etc."
            value={notes}
            onChangeText={setNotes}
            multiline
            style={{ minHeight: 80 }}
          />
        </Card>

        <Button
          title="Submit Request (Coming Soon)"
          icon="send-outline"
          onPress={() => {}}
          disabled
          size="lg"
        />
        <View style={{ height: spacing["2xl"] }} />
      </ScrollView>
    </View>
  );
}

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
  scrollContent: { padding: spacing["2xl"], gap: spacing.lg },
  comingSoonBanner: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: "flex-start",
  },
  comingSoonText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.primaryDark,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.lg,
  },
  bgGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  bgChip: {
    width: 56,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  bgChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  bgText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
  },
  bgTextActive: { color: colors.white },
  urgencyList: { gap: spacing.md },
  urgencyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  urgencyDot: { width: 10, height: 10, borderRadius: 5 },
  urgencyText: { flex: 1 },
  urgencyLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  urgencyDesc: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
});
