import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, Input } from "../src/components/ui";
import { colors, spacing, typography } from "../src/constants/theme";
import { useAuth } from "../src/context";
import { api, safeRequest } from "../src/lib/api";

interface ProfileForm {
  name: string;
  phone: string;
  region: string;
  town: string;
  neighbourhood: string;
  address: string;
  latitude: number;
  longitude: number;
  licenseNumber: string;
  // Doctor specific fields
  specialization: string;
  registrationNo: string;
}

const INITIAL: ProfileForm = {
  name: "",
  phone: "",
  region: "",
  town: "",
  neighbourhood: "",
  address: "",
  latitude: 0,
  longitude: 0,
  licenseNumber: "",
  specialization: "",
  registrationNo: "",
};

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

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { role, refreshUser, user } = useAuth();

  const [formData, setFormData] = useState<ProfileForm>(INITIAL);
  const [errors, setErrors] = useState<Partial<ProfileForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        ...INITIAL,
        ...user.profile,
      } as unknown as ProfileForm);
    }
  }, [user]);

  const isDoctor = role === "DOCTOR";
  const entityType = isDoctor
    ? "Doctor"
    : role === "HOSPITAL"
      ? "Hospital"
      : "Blood Bank";

  const set = (field: keyof ProfileForm) => (value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e: Partial<ProfileForm> = {};
    if (!formData.name?.trim()) e.name = "Full name is required";
    if (!formData.phone?.trim()) e.phone = "Phone is required";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(formData.phone))
      e.phone = "Enter a valid phone number";

    if (isDoctor) {
      if (!formData.specialization?.trim())
        e.specialization = "Specialization is required";
      if (!formData.registrationNo?.trim())
        e.registrationNo = "Registration number is required";
    } else {
      if (!formData.region) e.region = "Region is required";
      if (!formData.town?.trim()) e.town = "Town is required";
      if (!formData.address?.trim()) e.address = "Address is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      let endpoint = "hospitals/profile";
      if (role === "BLOOD_BANK") endpoint = "blood-banks/profile";
      if (role === "DOCTOR") endpoint = "doctors/profile";

      const payload = isDoctor
        ? {
            name: formData.name,
            phone: formData.phone,
            specialization: formData.specialization,
            registrationNo: formData.registrationNo,
          }
        : {
            name: formData.name,
            phone: formData.phone,
            region: formData.region,
            town: formData.town,
            neighbourhood: formData.neighbourhood || undefined,
            address: formData.address,
            licenseNumber: formData.licenseNumber || undefined,
            latitude: Number(formData.latitude) || 0,
            longitude: Number(formData.longitude) || 0,
          };

      await safeRequest(api.patch(endpoint, { json: payload }));
      await refreshUser();
      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to save profile";
      Alert.alert("Submission Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card padding="lg">
            <Text style={styles.sectionTitle}>
              {isDoctor ? "Personal Info" : `${entityType} Information`}
            </Text>

            <Input
              label={isDoctor ? "Full Name *" : `${entityType} Name *`}
              icon={isDoctor ? "person-outline" : "business-outline"}
              placeholder={
                isDoctor
                  ? "Your full name"
                  : `Enter ${entityType.toLowerCase()} name`
              }
              value={formData.name}
              onChangeText={set("name")}
              error={errors.name}
            />

            {!isDoctor && (
              <Input
                label="License Number"
                icon="document-text-outline"
                placeholder="Registration / license number"
                value={formData.licenseNumber}
                onChangeText={set("licenseNumber")}
              />
            )}

            {isDoctor && (
              <>
                <Input
                  label="Specialization *"
                  icon="medical-outline"
                  placeholder="e.g. Cardiologist, Surgeon"
                  value={formData.specialization}
                  onChangeText={set("specialization")}
                  error={errors.specialization}
                />
                <Input
                  label="Registration Number *"
                  icon="id-card-outline"
                  placeholder="Medical registration number"
                  value={formData.registrationNo}
                  onChangeText={set("registrationNo")}
                  error={errors.registrationNo}
                />
              </>
            )}
          </Card>

          <Card padding="lg">
            <Text style={styles.sectionTitle}>
              {isDoctor ? "Contact Details" : "Contact & Location"}
            </Text>

            <Input
              label="Phone *"
              icon="call-outline"
              placeholder="+91 00000 00000"
              value={formData.phone}
              onChangeText={set("phone")}
              keyboardType="phone-pad"
              error={errors.phone}
            />

            {!isDoctor && (
              <>
                <Text style={[styles.fieldLabel, { marginBottom: spacing.sm }]}>
                  Region *
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.regionScroll}
                >
                  {REGIONS.map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={[
                        styles.regionChip,
                        formData.region === r && styles.regionChipActive,
                      ]}
                      onPress={() => set("region")(r)}
                    >
                      <Text
                        style={[
                          styles.regionChipText,
                          formData.region === r && styles.regionChipTextActive,
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
                      placeholder="e.g. Yaoundé"
                      value={formData.town}
                      onChangeText={set("town")}
                      error={errors.town}
                    />
                  </View>
                  <View style={styles.flex1}>
                    <Input
                      label="Neighbourhood"
                      icon="pin-outline"
                      placeholder="e.g. Bastos"
                      value={formData.neighbourhood}
                      onChangeText={set("neighbourhood")}
                    />
                  </View>
                </View>

                <Input
                  label="Street Address *"
                  icon="location-outline"
                  placeholder="Landmark or street info"
                  value={formData.address}
                  onChangeText={set("address")}
                  error={errors.address}
                />
              </>
            )}
          </Card>

          <Button
            title="Save Changes"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            size="lg"
            icon="save-outline"
          />

          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: spacing["2xl"],
    gap: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  flex1: { flex: 1 },
  spacer: { height: spacing["2xl"] },
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
  },
  regionScroll: {
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  regionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  regionChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  regionChipText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  regionChipTextActive: {
    color: colors.white,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.alertRed,
    marginTop: spacing.xs,
  },
});
