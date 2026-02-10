import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, View } from "react-native";
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

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, padding: 20, justifyContent: "center" }}
    >
      <View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {userRole === "HOSPITAL" ? "Hospital" : "Blood Bank"} Profile
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#666",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Complete your profile information
        </Text>

        {/* Organization Name */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            {userRole === "HOSPITAL" ? "Hospital" : "Blood Bank"} Name *
          </Text>
          <TextInput
            placeholder={
              userRole === "HOSPITAL"
                ? "Enter hospital name"
                : "Enter blood bank name"
            }
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 12,
              borderRadius: 8,
              fontSize: 16,
            }}
          />
        </View>

        {/* Address */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            Address *
          </Text>
          <TextInput
            placeholder="Enter street address"
            value={formData.address}
            onChangeText={(value) => handleInputChange("address", value)}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 12,
              borderRadius: 8,
              fontSize: 16,
            }}
          />
        </View>

        {/* City */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            City *
          </Text>
          <TextInput
            placeholder="Enter city"
            value={formData.city}
            onChangeText={(value) => handleInputChange("city", value)}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 12,
              borderRadius: 8,
              fontSize: 16,
            }}
          />
        </View>

        {/* State */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            State
          </Text>
          <TextInput
            placeholder="Enter state"
            value={formData.state}
            onChangeText={(value) => handleInputChange("state", value)}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 12,
              borderRadius: 8,
              fontSize: 16,
            }}
          />
        </View>

        {/* Pincode */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            Pincode
          </Text>
          <TextInput
            placeholder="Enter pincode"
            value={formData.pincode}
            onChangeText={(value) => handleInputChange("pincode", value)}
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 12,
              borderRadius: 8,
              fontSize: 16,
            }}
          />
        </View>

        {/* Phone */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            Phone *
          </Text>
          <TextInput
            placeholder="Enter phone number"
            value={formData.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            keyboardType="phone-pad"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 12,
              borderRadius: 8,
              fontSize: 16,
            }}
          />
        </View>

        {/* License Number */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            {userRole === "HOSPITAL" ? "Hospital" : "Blood Bank"} License Number
          </Text>
          <TextInput
            placeholder="Enter license number"
            value={formData.licenseNumber}
            onChangeText={(value) => handleInputChange("licenseNumber", value)}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 12,
              borderRadius: 8,
              fontSize: 16,
            }}
          />
        </View>

        <Button
          title={isLoading ? "Saving..." : "Complete Profile"}
          onPress={handleSubmitProfile}
          disabled={isLoading}
          color="#27ae60"
        />

        <View style={{ height: 12 }} />

        <Button title="Back" onPress={() => router.back()} color="#95a5a6" />
      </View>
    </ScrollView>
  );
}
