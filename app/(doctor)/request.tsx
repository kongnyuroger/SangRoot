import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, Input } from "../../src/components/ui";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../src/constants/theme";
import api, { safeRequest } from "../../src/lib/api";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

/** Map display labels → Prisma BloodGroup enum values */
const BLOOD_GROUP_MAP: Record<string, string> = {
  "A+": "A_POSITIVE",
  "A-": "A_NEGATIVE",
  "B+": "B_POSITIVE",
  "B-": "B_NEGATIVE",
  "O+": "O_POSITIVE",
  "O-": "O_NEGATIVE",
  "AB+": "AB_POSITIVE",
  "AB-": "AB_NEGATIVE",
};

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
    value: "ROUTINE",
    label: "Routine",
    desc: "Within 24 hours",
    color: colors.successGreen,
  },
];

const GENDERS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const CAMEROON_REGIONS = [
  "ADAMAWA",
  "CENTRE",
  "EAST",
  "FAR_NORTH",
  "LITTORAL",
  "NORTH",
  "NORTH_WEST",
  "WEST",
  "SOUTH",
  "SOUTH_WEST",
];

/** Human-readable region labels */
const REGION_LABELS: Record<string, string> = {
  ADAMAWA: "Adamawa",
  CENTRE: "Centre",
  EAST: "East",
  FAR_NORTH: "Far North",
  LITTORAL: "Littoral",
  NORTH: "North",
  NORTH_WEST: "North West",
  WEST: "West",
  SOUTH: "South",
  SOUTH_WEST: "South West",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a Date object to a readable "DD MMM YYYY" string */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DoctorProfile = {
  id: string;
  name: string;
  phone: string;
  hospital?: {
    id: string;
    name: string;
    region: string;
    town: string;
  };
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DoctorRequestScreen() {
  const insets = useSafeAreaInsets();

  // Form state
  const [bloodGroup, setBloodGroup] = useState("");
  const [urgency, setUrgency] = useState("URGENT");
  const [units, setUnits] = useState("1");
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("MALE");
  const [hospitalName, setHospitalName] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [requiredBy, setRequiredBy] = useState<Date | null>(null); // ← Date object
  const [showDatePicker, setShowDatePicker] = useState(false); // ← picker visibility
  const [medicalReason, setMedicalReason] = useState("");
  const [notes, setNotes] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showRegionPicker, setShowRegionPicker] = useState(false);

  // ── Auto-fill hospital info from doctor profile ────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const profile = await safeRequest(
          api.get("doctors/profile").json<DoctorProfile>(),
        );
        if (profile?.hospital) {
          setHospitalName(profile.hospital.name);
          setRegion(profile.hospital.region);
          setTown(profile.hospital.town);
        }
      } catch {
        // If profile fetch fails, user can still type manually
      } finally {
        setProfileLoading(false);
      }
    })();
  }, []);

  // ── Validation ─────────────────────────────────────────────────────────
  const isValid =
    bloodGroup !== "" &&
    urgency !== "" &&
    parseInt(units, 10) >= 1 &&
    patientName.trim() !== "" &&
    parseInt(patientAge, 10) >= 0 &&
    patientGender !== "" &&
    hospitalName.trim() !== "" &&
    region !== "" &&
    town.trim() !== "" &&
    requiredBy !== null; // ← check Date object

  // ── Date picker handler ────────────────────────────────────────────────
  const handleDateChange = useCallback(
    (_event: unknown, selectedDate?: Date) => {
      // On Android the picker closes itself; on iOS keep it open until dismissed
      if (Platform.OS === "android") setShowDatePicker(false);
      if (selectedDate) setRequiredBy(selectedDate);
    },
    [],
  );

  // ── Submit handler ─────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!isValid || !requiredBy) return;

    setLoading(true);
    try {
      await safeRequest(
        api
          .post("blood-requests", {
            json: {
              bloodGroup: BLOOD_GROUP_MAP[bloodGroup],
              unitsRequired: parseInt(units, 10),
              urgency,
              patientName: patientName.trim(),
              patientAge: parseInt(patientAge, 10),
              patientGender,
              hospitalName: hospitalName.trim(),
              region,
              town: town.trim(),
              neighbourhood: neighbourhood.trim() || undefined,
              requiredBy: requiredBy.toISOString(), // ← ISO string from Date
              medicalReason: medicalReason.trim() || undefined,
              notes: notes.trim() || undefined,
            },
          })
          .json(),
      );

      Alert.alert(
        "Request Submitted ✅",
        "Your blood request has been submitted. Our AI system is now contacting donors and blood banks in your area. You will receive WhatsApp updates on the progress.",
        [{ text: "OK" }],
      );

      // Reset form
      setBloodGroup("");
      setUrgency("URGENT");
      setUnits("1");
      setPatientName("");
      setPatientAge("");
      setPatientGender("MALE");
      setRequiredBy(null);
      setMedicalReason("");
      setNotes("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      Alert.alert("Submission Failed", message);
    } finally {
      setLoading(false);
    }
  }, [
    isValid,
    bloodGroup,
    units,
    urgency,
    patientName,
    patientAge,
    patientGender,
    hospitalName,
    region,
    town,
    neighbourhood,
    requiredBy,
    medicalReason,
    notes,
  ]);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Blood Request</Text>
        <Text style={styles.pageSubtitle}>
          Raise an emergency blood request — our AI will handle outreach
        </Text>
      </View>

      {profileLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your profile…</Text>
        </View>
      ) : (
        // ── KeyboardAwareScrollView keeps inputs visible above keyboard ──
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={16}
        >
          {/* ── Blood Group ─────────────────────────────────────────── */}
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

          {/* ── Urgency ─────────────────────────────────────────────── */}
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
                  <View style={styles.urgencyTextWrap}>
                    <Text style={styles.urgencyLabel}>{u.label}</Text>
                    <Text style={styles.urgencyDesc}>{u.desc}</Text>
                  </View>
                  {urgency === u.value && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={u.color}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* ── Units & Required By ────────────────────────────────── */}
          <Card padding="lg">
            <Input
              label="Units Required *"
              icon="layers-outline"
              placeholder="e.g. 2"
              value={units}
              onChangeText={setUnits}
              keyboardType="numeric"
            />
            <View style={{ height: spacing.md }} />

            {/* ── Date picker trigger ───────────────────────────────── */}
            <Text style={styles.fieldLabel}>Required By (Date) *</Text>
            <TouchableOpacity
              style={styles.pickerTrigger}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text
                style={[
                  styles.pickerText,
                  !requiredBy && { color: colors.textLight },
                ]}
              >
                {requiredBy ? formatDate(requiredBy) : "Select date"}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Native date picker — shown inline on iOS, as dialog on Android */}
            {showDatePicker && (
              <DateTimePicker
                value={requiredBy ?? new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                minimumDate={new Date()}
                onChange={handleDateChange}
                style={Platform.OS === "ios" ? styles.iosDatePicker : undefined}
              />
            )}

            {/* iOS dismiss button */}
            {showDatePicker && Platform.OS === "ios" && (
              <TouchableOpacity
                style={styles.iosDismiss}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.iosDismissText}>Done</Text>
              </TouchableOpacity>
            )}
          </Card>

          {/* ── Patient Info ────────────────────────────────────────── */}
          <Card padding="lg">
            <Text style={styles.sectionLabel}>Patient Information</Text>
            <Input
              label="Patient Name *"
              icon="person-outline"
              placeholder="Full name"
              value={patientName}
              onChangeText={setPatientName}
            />
            <View style={{ height: spacing.md }} />
            <Input
              label="Patient Age *"
              icon="calendar-outline"
              placeholder="e.g. 35"
              value={patientAge}
              onChangeText={setPatientAge}
              keyboardType="numeric"
            />
            <View style={{ height: spacing.md }} />
            <Text style={styles.fieldLabel}>Gender *</Text>
            <View style={styles.chipRow}>
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g.value}
                  style={[
                    styles.genderChip,
                    patientGender === g.value && styles.genderChipActive,
                  ]}
                  onPress={() => setPatientGender(g.value)}
                >
                  <Text
                    style={[
                      styles.genderText,
                      patientGender === g.value && styles.genderTextActive,
                    ]}
                  >
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* ── Hospital / Location ─────────────────────────────────── */}
          <Card padding="lg">
            <Text style={styles.sectionLabel}>Hospital & Location</Text>
            <Input
              label="Hospital Name *"
              icon="business-outline"
              placeholder="Hospital name"
              value={hospitalName}
              onChangeText={setHospitalName}
            />
            <View style={{ height: spacing.md }} />

            {/* Region picker */}
            <Text style={styles.fieldLabel}>Region *</Text>
            <TouchableOpacity
              style={styles.pickerTrigger}
              onPress={() => setShowRegionPicker(!showRegionPicker)}
            >
              <Ionicons
                name="location-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text
                style={[
                  styles.pickerText,
                  !region && { color: colors.textLight },
                ]}
              >
                {region ? REGION_LABELS[region] || region : "Select region"}
              </Text>
              <Ionicons
                name={showRegionPicker ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {showRegionPicker && (
              <View style={styles.regionList}>
                {CAMEROON_REGIONS.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.regionItem,
                      region === r && styles.regionItemActive,
                    ]}
                    onPress={() => {
                      setRegion(r);
                      setShowRegionPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.regionItemText,
                        region === r && styles.regionItemTextActive,
                      ]}
                    >
                      {REGION_LABELS[r] || r}
                    </Text>
                    {region === r && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={{ height: spacing.md }} />
            <Input
              label="Town *"
              icon="navigate-outline"
              placeholder="e.g. Yaoundé"
              value={town}
              onChangeText={setTown}
            />
            <View style={{ height: spacing.md }} />
            <Input
              label="Neighbourhood"
              icon="map-outline"
              placeholder="e.g. Ngousso (optional)"
              value={neighbourhood}
              onChangeText={setNeighbourhood}
            />
          </Card>

          {/* ── Additional Info ──────────────────────────────────────── */}
          <Card padding="lg">
            <Input
              label="Medical Reason"
              icon="medkit-outline"
              placeholder="e.g. Surgery, accident trauma (optional)"
              value={medicalReason}
              onChangeText={setMedicalReason}
            />
            <View style={{ height: spacing.md }} />
            <Input
              label="Additional Notes"
              icon="document-text-outline"
              placeholder="Ward number, special instructions (optional)"
              value={notes}
              onChangeText={setNotes}
              multiline
              style={{ minHeight: 80 }}
            />
          </Card>

          {/* ── Submit ──────────────────────────────────────────────── */}
          <Button
            title={loading ? "Submitting…" : "Submit Blood Request"}
            icon={loading ? undefined : "send-outline"}
            onPress={handleSubmit}
            disabled={!isValid || loading}
            size="lg"
          />
          {loading && (
            <ActivityIndicator
              style={{ marginTop: spacing.md }}
              color={colors.primary}
            />
          )}
          <View style={{ height: spacing["2xl"] }} />
        </KeyboardAwareScrollView>
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
  scrollContent: { padding: spacing["2xl"], gap: spacing.lg },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.lg,
  },
  loadingText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  sectionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  // Blood group chips
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
  // Urgency
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
  urgencyTextWrap: { flex: 1 },
  urgencyLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  urgencyDesc: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  // Gender chips
  chipRow: { flexDirection: "row", gap: spacing.sm },
  genderChip: {
    flex: 1,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  genderChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  genderTextActive: { color: colors.white },
  // Shared picker trigger style (used for both region & date)
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  pickerText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  // iOS date picker
  iosDatePicker: {
    marginTop: spacing.sm,
    alignSelf: "stretch",
  },
  iosDismiss: {
    alignSelf: "flex-end",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  iosDismissText: {
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
  },
  // Region list
  regionList: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    maxHeight: 200,
    overflow: "hidden",
  },
  regionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  regionItemActive: {
    backgroundColor: colors.primaryLight,
  },
  regionItemText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  regionItemTextActive: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeight.semibold,
  },
});
