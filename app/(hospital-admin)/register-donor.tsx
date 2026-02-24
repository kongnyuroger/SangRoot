import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { registerDonor } from "../../src/services/hospital.service";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

interface DonorForm {
  name: string;
  phone: string;
  email: string;
  bloodGroup: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const INITIAL: DonorForm = {
  name: "",
  phone: "",
  email: "",
  bloodGroup: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function HospitalRegisterDonorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<DonorForm>(INITIAL);
  const [errors, setErrors] = useState<Partial<DonorForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const set = (field: keyof DonorForm) => (val: string) => {
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e: Partial<DonorForm> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.bloodGroup) e.bloodGroup = "Select a blood group";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await registerDonor({
        ...form,
        latitude: 0,
        longitude: 0,
        isAvailable: true,
      });
      Alert.alert("✅ Success", "Donor registered successfully!");
      setForm(INITIAL);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to register donor";
      Alert.alert("Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Register Donor</Text>
        <Text style={styles.pageSubtitle}>
          Add a new blood donor to the network
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
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
          />
          <Input
            label="Phone *"
            icon="call-outline"
            placeholder="+91 00000 00000"
            value={form.phone}
            onChangeText={set("phone")}
            keyboardType="phone-pad"
            error={errors.phone}
          />
          <Input
            label="Email (Optional)"
            icon="mail-outline"
            placeholder="donor@email.com"
            value={form.email}
            onChangeText={set("email")}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </Card>

        <Card padding="lg">
          <Text style={styles.sectionLabel}>Blood Group *</Text>
          {errors.bloodGroup && (
            <Text style={styles.errorText}>{errors.bloodGroup}</Text>
          )}
          <View style={styles.bloodGroupGrid}>
            {BLOOD_GROUPS.map((bg) => (
              <TouchableOpacity
                key={bg}
                style={[
                  styles.bgChip,
                  form.bloodGroup === bg && styles.bgChipActive,
                ]}
                onPress={() => set("bloodGroup")(bg)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.bgChipText,
                    form.bloodGroup === bg && styles.bgChipTextActive,
                  ]}
                >
                  {bg}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card padding="lg">
          <Text style={styles.sectionLabel}>Location</Text>
          <Input
            label="Address *"
            icon="location-outline"
            placeholder="Street address"
            value={form.address}
            onChangeText={set("address")}
            error={errors.address}
          />
          <Input
            label="City *"
            icon="navigate-outline"
            placeholder="City"
            value={form.city}
            onChangeText={set("city")}
            error={errors.city}
          />
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Input
                label="State"
                icon="map-outline"
                placeholder="State"
                value={form.state}
                onChangeText={set("state")}
              />
            </View>
            <View style={styles.flex1}>
              <Input
                label="Pincode"
                icon="pin-outline"
                placeholder="000000"
                value={form.pincode}
                onChangeText={set("pincode")}
                keyboardType="numeric"
              />
            </View>
          </View>
        </Card>

        <Button
          title="Register Donor"
          icon="person-add-outline"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          size="lg"
        />
        <View style={styles.spacer} />
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
  sectionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.lg,
  },
  bloodGroupGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
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
  bgChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
  },
  bgChipTextActive: { color: colors.white },
  row: { flexDirection: "row", gap: spacing.md },
  flex1: { flex: 1 },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.alertRed,
    marginBottom: spacing.sm,
  },
  spacer: { height: spacing["2xl"] },
});
