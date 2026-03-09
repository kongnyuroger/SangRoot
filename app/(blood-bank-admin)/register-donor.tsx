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
import { Button, Card, Input } from "../../src/components/ui";
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from "../../src/constants/theme";
import { safeRequest } from "../../src/lib/api";
import { registerDonor } from "../../src/services/blood-bank.service";
import { mapBloodGroupToBackend } from "../../src/utils/bloodGroup";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

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

export default function BloodBankRegisterDonorScreen() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<DonorForm>(INITIAL);
  const [errors, setErrors] = useState<Partial<DonorForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const set = (field: keyof DonorForm) => (val: string) => {
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e: Partial<DonorForm> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.bloodGroup) e.bloodGroup = "Select a blood group";
    if (!form.dateBirth.trim()) e.dateBirth = "Date of birth is required";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.dateBirth))
      e.dateBirth = "Use YYYY-MM-DD format";
    if (!form.genre) e.genre = "Select gender";
    if (!form.region) e.region = "Select region";
    if (!form.town.trim()) e.town = "Town is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

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
      Alert.alert("✅ Success", "Donor registered successfully!");
      setForm(INITIAL);
    } catch (e: unknown) {
      Alert.alert(
        "Error",
        e instanceof Error ? e.message : "Failed to register donor",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to scroll to a specific input when it's focused
  const scrollToInput = (yPosition: number) => {
    scrollViewRef.current?.scrollTo({
      y: yPosition,
      animated: true,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Register Donor</Text>
        <Text style={styles.pageSubtitle}>
          Add a donor to the blood bank network
        </Text>
      </View>

      {/* Add KeyboardAvoidingView with proper behavior */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : insets.top}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          // Add these props for better keyboard handling
          keyboardDismissMode="interactive"
          // Enable this to automatically adjust content inset
          automaticallyAdjustContentInsets={true}
          // Add scroll event throttling for better performance
          scrollEventThrottle={16}
        >
          <Card padding="lg">
            <Text style={styles.sectionLabel}>Personal Details</Text>
            <Input
              label="Full Name *"
              icon="person-outline"
              placeholder="Donor's full name"
              value={form.name}
              onChangeText={set("name")}
              error={errors.name}
              onFocus={() => {
                // Scroll to this input when focused
                scrollToInput(0);
              }}
            />
            <Input
              label="Phone *"
              icon="call-outline"
              placeholder="+91 00000 00000"
              value={form.phone}
              onChangeText={set("phone")}
              keyboardType="phone-pad"
              error={errors.phone}
              onFocus={() => {
                scrollToInput(100); // Adjust based on actual layout
              }}
            />
            <Input
              label="Email (Optional)"
              icon="mail-outline"
              placeholder="donor@email.com"
              value={form.email}
              onChangeText={set("email")}
              autoCapitalize="none"
              keyboardType="email-address"
              onFocus={() => {
                scrollToInput(200);
              }}
            />

            <Input
              label="Date of Birth *"
              icon="calendar-outline"
              placeholder="YYYY-MM-DD"
              value={form.dateBirth}
              onChangeText={set("dateBirth")}
              error={errors.dateBirth}
              onFocus={() => {
                scrollToInput(300);
              }}
            />

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
                    // Dismiss keyboard when selecting gender
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
                  onFocus={() => {
                    scrollToInput(800); // Adjust based on actual layout
                  }}
                />
              </View>
              <View style={styles.flex1}>
                <Input
                  label="Neighbourhood"
                  icon="pin-outline"
                  placeholder="Quartier"
                  value={form.neighbourhood}
                  onChangeText={set("neighbourhood")}
                  onFocus={() => {
                    scrollToInput(900); // Adjust based on actual layout
                  }}
                />
              </View>
            </View>
          </Card>

          {/* Add some extra bottom padding to ensure button is visible */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
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
    // Add extra padding at the bottom to ensure content is above keyboard
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
  bgGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
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
  row: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },
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
  regionScroll: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});
