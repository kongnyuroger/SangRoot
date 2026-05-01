import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { borderRadius, colors, spacing, typography } from "../constants/theme";
import { safeRequest } from "../lib/api";
import { mapBloodGroupToBackend } from "../utils/bloodGroup";
import { Button, Card, Input } from "./ui";

// ─── types ────────────────────────────────────────────────────────────────────

interface DonorForm {
  name: string;
  phone: string;
  email: string;
  bloodGroup: string;
  dateBirth: string;
  genre: string;
  region: string;
  town: string;
  neighbourhood: string;
}

export interface RegisterDonorScreenProps {
  registeredBy?: string;

  onSuccess?: () => void;

  registerDonor: (data: any) => Promise<any>;
}

// ─── constants ────────────────────────────────────────────────────────────────

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const GENDERS = ["MALE", "FEMALE"];
const REGIONS = [
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

const INITIAL: DonorForm = {
  name: "",
  phone: "",
  email: "",
  bloodGroup: "",
  dateBirth: "",
  genre: "",
  region: "",
  town: "",
  neighbourhood: "",
};

// Donors must be at least 16 years old
const MAX_DATE = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 16);
  return d;
})();

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const prettyDate = (iso: string): string => {
  if (!iso) return "Select date of birth";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ─── component ────────────────────────────────────────────────────────────────

export default function RegisterDonorScreen({
  registeredBy = "Donor",
  onSuccess,
  registerDonor,
}: RegisterDonorScreenProps) {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [form, setForm] = useState<DonorForm>(INITIAL);
  const [errors, setErrors] = useState<Partial<DonorForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  // date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(MAX_DATE);

  // ── field helpers ───────────────────────────────────────────────────────────

  const set = (field: keyof DonorForm) => (val: string) => {
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const clearError = (field: keyof DonorForm) =>
    setErrors((p) => ({ ...p, [field]: undefined }));

  // ── date picker ─────────────────────────────────────────────────────────────

  const openDatePicker = () => {
    Keyboard.dismiss();
    if (form.dateBirth) {
      const [y, m, d] = form.dateBirth.split("-").map(Number);
      setPickerDate(new Date(y, m - 1, d));
    }
    setShowDatePicker(true);
  };

  const onDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (event.type === "dismissed") return;
    if (selected) {
      setPickerDate(selected);
      setForm((p) => ({ ...p, dateBirth: formatDate(selected) }));
      clearError("dateBirth");
    }
  };

  // ── validation ──────────────────────────────────────────────────────────────

  const validate = () => {
    const e: Partial<DonorForm> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.bloodGroup) e.bloodGroup = "Select a blood group";
    if (!form.dateBirth.trim()) e.dateBirth = "Date of birth is required";
    if (!form.genre) e.genre = "Select gender";
    if (!form.region) e.region = "Select region";
    if (!form.town.trim()) e.town = "Town is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await safeRequest(
        registerDonor({
          ...form,
          bloodGroup: mapBloodGroupToBackend(form.bloodGroup),
        }),
      );

      setForm(INITIAL); // ← always clears the form on success

      if (onSuccess) {
        onSuccess();
      } else {
        Alert.alert("✅ Success", "Donor registered successfully!");
      }
    } catch (e: unknown) {
      const status = (e as any)?.response?.status ?? (e as any)?.status;
      const message =
        (e as any)?.response?.data?.message ??
        (e instanceof Error ? e.message : "Failed to register donor");

      if (status === 409) {
        if (message.toLowerCase().includes("email")) {
          setErrors((prev) => ({
            ...prev,
            email: "A donor with this email address already exists.",
          }));
          scrollViewRef.current?.scrollTo({ y: 200, animated: true });
        } else {
          setErrors((prev) => ({
            ...prev,
            phone: "A donor with this phone number already exists.",
          }));
          scrollViewRef.current?.scrollTo({ y: 100, animated: true });
        }
      } else {
        Alert.alert("Error", message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToInput = (y: number) =>
    scrollViewRef.current?.scrollTo({ y, animated: true });

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Register Donor</Text>
        <Text style={styles.pageSubtitle}>
          Registering on behalf of: {registeredBy}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : insets.top}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator
          keyboardDismissMode="interactive"
          automaticallyAdjustContentInsets
          scrollEventThrottle={16}
        >
          {/* Personal Details */}
          <Card padding="lg">
            <Text style={styles.sectionLabel}>Personal Details</Text>

            <Input
              label="Full Name *"
              icon="person-outline"
              placeholder="Donor's full name"
              value={form.name}
              onChangeText={set("name")}
              error={errors.name}
              onFocus={() => scrollToInput(0)}
            />
            <Input
              label="Phone *"
              icon="call-outline"
              placeholder="+237 67X XX XX XX"
              value={form.phone}
              onChangeText={set("phone")}
              keyboardType="phone-pad"
              error={errors.phone}
              onFocus={() => scrollToInput(100)}
            />
            <Input
              label="Email (Optional)"
              icon="mail-outline"
              placeholder="donor@email.com"
              value={form.email}
              onChangeText={set("email")}
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email}
              onFocus={() => scrollToInput(200)}
            />

            {/* Date of Birth */}
            <Text style={styles.fieldLabel}>Date of Birth *</Text>
            <TouchableOpacity
              style={[
                styles.dateButton,
                errors.dateBirth ? styles.dateButtonError : null,
              ]}
              onPress={openDatePicker}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dateButtonText,
                  !form.dateBirth && styles.dateButtonPlaceholder,
                ]}
              >
                {prettyDate(form.dateBirth)}
              </Text>
              <Text style={styles.dateIcon}></Text>
            </TouchableOpacity>
            {errors.dateBirth && (
              <Text style={styles.errorText}>{errors.dateBirth}</Text>
            )}

            {showDatePicker && Platform.OS === "android" && (
              <DateTimePicker
                mode="date"
                display="default"
                value={pickerDate}
                maximumDate={MAX_DATE}
                onChange={onDateChange}
              />
            )}
            {showDatePicker && Platform.OS === "ios" && (
              <View style={styles.iosPickerWrapper}>
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={pickerDate}
                  maximumDate={MAX_DATE}
                  onChange={onDateChange}
                  style={styles.iosPicker}
                />
                <TouchableOpacity
                  style={styles.iosConfirmBtn}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.iosConfirmText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Gender */}
            <Text style={[styles.sectionLabel, { marginTop: spacing.md }]}>
              Gender *
            </Text>
            <View style={styles.genderRow}>
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderChip,
                    form.genre === g && styles.genderChipActive,
                  ]}
                  onPress={() => {
                    set("genre")(g);
                    Keyboard.dismiss();
                  }}
                >
                  <Text
                    style={[
                      styles.genderText,
                      form.genre === g && styles.genderTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.genre && (
              <Text style={styles.errorText}>{errors.genre}</Text>
            )}
          </Card>

          {/* Blood Group */}
          <Card padding="lg">
            <Text style={styles.sectionLabel}>Blood Group *</Text>
            {errors.bloodGroup && (
              <Text style={styles.errorText}>{errors.bloodGroup}</Text>
            )}
            <View style={styles.bgGrid}>
              {BLOOD_GROUPS.map((bg) => (
                <TouchableOpacity
                  key={bg}
                  style={[
                    styles.bgChip,
                    form.bloodGroup === bg && styles.bgChipActive,
                  ]}
                  onPress={() => {
                    set("bloodGroup")(bg);
                    Keyboard.dismiss();
                  }}
                >
                  <Text
                    style={[
                      styles.bgText,
                      form.bloodGroup === bg && styles.bgTextActive,
                    ]}
                  >
                    {bg}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Location */}
          <Card padding="lg">
            <Text style={styles.sectionLabel}>Region *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.regionScroll}
            >
              {REGIONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.bgChip,
                    { width: "auto", paddingHorizontal: spacing.md },
                    form.region === r && styles.bgChipActive,
                  ]}
                  onPress={() => {
                    set("region")(r);
                    Keyboard.dismiss();
                  }}
                >
                  <Text
                    style={[
                      styles.bgText,
                      form.region === r && styles.bgTextActive,
                    ]}
                  >
                    {r.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.region && (
              <Text style={styles.errorText}>{errors.region}</Text>
            )}

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Input
                  label="Town *"
                  icon="navigate-outline"
                  placeholder="Town"
                  value={form.town}
                  onChangeText={set("town")}
                  error={errors.town}
                  onFocus={() => scrollToInput(800)}
                />
              </View>
              <View style={styles.flex1}>
                <Input
                  label="Neighbourhood"
                  icon="pin-outline"
                  placeholder="Quartier"
                  value={form.neighbourhood}
                  onChangeText={set("neighbourhood")}
                  onFocus={() => scrollToInput(900)}
                />
              </View>
            </View>
          </Card>

          <View style={styles.buttonContainer}>
            <Button
              title="Register Donor"
              icon="person-add-outline"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              size="lg"
            />
          </View>
          <View style={{ height: spacing["2xl"] }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboardAvoidingView: { flex: 1 },
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
  scrollContent: {
    padding: spacing["2xl"],
    gap: spacing.lg,
    paddingBottom: spacing["2xl"] * 2,
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
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.xs,
  },
  dateButtonError: { borderColor: colors.alertRed },
  dateButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  dateButtonPlaceholder: { color: colors.textSecondary },
  dateIcon: { fontSize: 18 },
  iosPickerWrapper: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  iosPicker: { width: "100%" },
  iosConfirmBtn: {
    alignItems: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  iosConfirmText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
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
  row: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md },
  flex1: { flex: 1 },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.alertRed,
    marginBottom: spacing.sm,
  },
  genderRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
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
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
  },
  genderTextActive: { color: colors.white },
  regionScroll: { gap: spacing.sm, paddingBottom: spacing.md },
  buttonContainer: { marginTop: spacing.md },
});
