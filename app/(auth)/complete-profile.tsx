import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { AuthCard } from "../../src/components/auth/AuthCard";
import { AuthHeader } from "../../src/components/auth/AuthHeader";
import { StyledButton } from "../../src/components/auth/StyledButton";
import { StyledInput } from "../../src/components/auth/StyledInput";
import { colors, spacing } from "../../src/constants/theme";
import { api } from "../../src/lib/api";

type UserRole = "DOCTOR" | "HOSPITAL" | "BLOOD_BANK";

interface HospitalProfile {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  latitude: string | null;
  longitude: string | null;
  licenseNumber: string;
}

interface BloodBankProfile {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  latitude: string | null;
  longitude: string | null;
  licenseNumber: string;
}

export default function CompleteProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userRole = (params.role as UserRole) || "HOSPITAL";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<HospitalProfile | BloodBankProfile>({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    latitude: null,
    longitude: null,
    licenseNumber: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitProfile = async () => {
    // Validate required fields
    if (
      !formData.name ||
      !formData.address ||
      !formData.city ||
      !formData.phone
    ) {
      Alert.alert(
        "Required Fields",
        "Please fill in name, address, city, and phone",
      );
      return;
    }

    setIsLoading(true);
    try {
      const endpoint =
        userRole === "HOSPITAL" ? "hospitals/profile" : "blood-banks/profile";

      // Use api client (handles base URL and auth headers) and PATCH method
      await api.patch(endpoint, { json: formData });

      Alert.alert("Success", "Profile completed successfully!");

      // Navigate to respective dashboard
      if (userRole === "HOSPITAL") {
        router.replace("/(hospital-admin)/register-donor");
      } else if (userRole === "BLOOD_BANK") {
        router.replace("/(blood-bank-admin)/register-donor");
      }
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to complete profile";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const entityType = userRole === "HOSPITAL" ? "Hospital" : "Blood Bank";
  const icon = userRole === "HOSPITAL" ? "business-outline" : "water-outline";

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          icon={icon}
          title={`${entityType} Profile`}
          subtitle="Complete your profile information"
        />

        <AuthCard>
          <StyledInput
            label={`${entityType} Name *`}
            icon="business-outline"
            placeholder={`Enter ${entityType.toLowerCase()} name`}
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
          />

          <StyledInput
            label="Address *"
            icon="location-outline"
            placeholder="Enter street address"
            value={formData.address}
            onChangeText={(value) => handleInputChange("address", value)}
          />

          <StyledInput
            label="City *"
            icon="navigate-outline"
            placeholder="Enter city"
            value={formData.city}
            onChangeText={(value) => handleInputChange("city", value)}
          />

          <StyledInput
            label="State"
            icon="map-outline"
            placeholder="Enter state"
            value={formData.state}
            onChangeText={(value) => handleInputChange("state", value)}
          />

          <StyledInput
            label="Pincode"
            icon="pin-outline"
            placeholder="Enter pincode"
            value={formData.pincode}
            onChangeText={(value) => handleInputChange("pincode", value)}
            keyboardType="numeric"
          />

          <StyledInput
            label="Phone *"
            icon="call-outline"
            placeholder="Enter phone number"
            value={formData.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            keyboardType="phone-pad"
          />

          <StyledInput
            label={`${entityType} License Number`}
            icon="document-text-outline"
            placeholder="Enter license number"
            value={formData.licenseNumber}
            onChangeText={(value) => handleInputChange("licenseNumber", value)}
          />

          <StyledButton
            title={isLoading ? "Saving..." : "Complete Profile"}
            onPress={handleSubmitProfile}
            loading={isLoading}
            disabled={isLoading}
          />

          <View style={styles.divider} />

          <StyledButton
            title="Back"
            onPress={() => router.back()}
            variant="outline"
          />
        </AuthCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingTop: spacing["2xl"],
    paddingBottom: spacing["2xl"],
  },
  divider: {
    height: spacing.md,
  },
});
