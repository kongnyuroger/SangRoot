import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, Input } from "../../src/components/ui";
import { colors, spacing, typography } from "../../src/constants/theme";
import { useAuth } from "../../src/context";
import { api } from "../../src/lib/api";

interface ProfileForm {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  licenseNumber: string;
}

const INITIAL: ProfileForm = {
  name: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  licenseNumber: "",
};

export default function CompleteProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { role, refreshUser } = useAuth();
  const [formData, setFormData] = useState<ProfileForm>(INITIAL);
  const [errors, setErrors] = useState<Partial<ProfileForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const entityType = role === "HOSPITAL" ? "Hospital" : "Blood Bank";

  const set = (field: keyof ProfileForm) => (value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e: Partial<ProfileForm> = {};
    if (!formData.name.trim()) e.name = `${entityType} name is required`;
    if (!formData.address.trim()) e.address = "Address is required";
    if (!formData.city.trim()) e.city = "City is required";
    if (!formData.phone.trim()) e.phone = "Phone is required";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(formData.phone))
      e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Completion progress
  const fields = Object.values(formData);
  const filled = fields.filter(Boolean).length;
  const progress = Math.round((filled / fields.length) * 100);

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const endpoint =
        role === "HOSPITAL" ? "hospitals/profile" : "blood-banks/profile";
      await api.patch(endpoint, { json: formData });
      await refreshUser();
      // Navigation guard will redirect to dashboard after refreshUser
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to save profile";
      setErrors({ name: msg });
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
        {/* Sticky header */}
        <View style={styles.stickyHeader}>
          <Text style={styles.headerTitle}>Complete Profile</Text>
          <Text style={styles.headerSub}>
            Required before accessing your dashboard
          </Text>
          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{progress}% complete</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card padding="lg">
            <Text style={styles.sectionTitle}>{entityType} Information</Text>

            <Input
              label={`${entityType} Name *`}
              icon="business-outline"
              placeholder={`Enter ${entityType.toLowerCase()} name`}
              value={formData.name}
              onChangeText={set("name")}
              error={errors.name}
            />
            <Input
              label={`License Number`}
              icon="document-text-outline"
              placeholder="Registration / license number"
              value={formData.licenseNumber}
              onChangeText={set("licenseNumber")}
            />
          </Card>

          <Card padding="lg">
            <Text style={styles.sectionTitle}>Contact & Location</Text>

            <Input
              label="Phone *"
              icon="call-outline"
              placeholder="+91 00000 00000"
              value={formData.phone}
              onChangeText={set("phone")}
              keyboardType="phone-pad"
              error={errors.phone}
            />
            <Input
              label="Street Address *"
              icon="location-outline"
              placeholder="Building, street, area"
              value={formData.address}
              onChangeText={set("address")}
              error={errors.address}
            />
            <Input
              label="City *"
              icon="navigate-outline"
              placeholder="City"
              value={formData.city}
              onChangeText={set("city")}
              error={errors.city}
            />
            <View style={styles.row}>
              <View style={styles.flex1}>
                <Input
                  label="State"
                  icon="map-outline"
                  placeholder="State"
                  value={formData.state}
                  onChangeText={set("state")}
                />
              </View>
              <View style={styles.flex1}>
                <Input
                  label="Pincode"
                  icon="pin-outline"
                  placeholder="000000"
                  value={formData.pincode}
                  onChangeText={set("pincode")}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </Card>

          <Button
            title="Save & Continue"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            size="lg"
            icon="checkmark-circle-outline"
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
  stickyHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing["2xl"],
    paddingTop: spacing.lg,
    paddingBottom: spacing["2xl"],
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSub: {
    fontSize: typography.fontSize.sm,
    color: "rgba(255,255,255,0.75)",
    marginBottom: spacing.lg,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: typography.fontSize.xs,
    color: "rgba(255,255,255,0.75)",
    marginTop: spacing.sm,
    textAlign: "right",
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
});
