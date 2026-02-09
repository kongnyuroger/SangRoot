import React, { useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, View } from "react-native";
import { registerDonor } from "../../src/services/hospital.service";

export default function HospitalAdminRegisterDonorScreen() {
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    // Basic validation
    if (
      !formData.name ||
      !formData.bloodGroup ||
      !formData.phone ||
      !formData.age ||
      !formData.gender
    ) {
      Alert.alert("Required", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      await registerDonor({
        ...formData,
        age: parseInt(formData.age, 10),
      });
      Alert.alert("Success", "Donor registered successfully!");
      setFormData({
        name: "",
        bloodGroup: "",
        phone: "",
        email: "",
        age: "",
        gender: "",
      });
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to register donor";
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Register Donor
      </Text>

      {/* Name */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 4, color: "#666" }}>Full Name *</Text>
        <TextInput
          placeholder="Donor Name"
          value={formData.name}
          onChangeText={(v) => handleChange("name", v)}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            borderRadius: 8,
          }}
        />
      </View>

      {/* Blood Group */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 4, color: "#666" }}>
          Blood Group * (e.g., A+, O-)
        </Text>
        <TextInput
          placeholder="Blood Group"
          value={formData.bloodGroup}
          onChangeText={(v) => handleChange("bloodGroup", v)}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            borderRadius: 8,
          }}
        />
      </View>

      {/* Phone */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 4, color: "#666" }}>Phone *</Text>
        <TextInput
          placeholder="Phone Number"
          value={formData.phone}
          onChangeText={(v) => handleChange("phone", v)}
          keyboardType="phone-pad"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            borderRadius: 8,
          }}
        />
      </View>

      {/* Email */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 4, color: "#666" }}>Email (Optional)</Text>
        <TextInput
          placeholder="Email Address"
          value={formData.email}
          onChangeText={(v) => handleChange("email", v)}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            borderRadius: 8,
          }}
        />
      </View>

      {/* Age */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 4, color: "#666" }}>Age *</Text>
        <TextInput
          placeholder="Age"
          value={formData.age}
          onChangeText={(v) => handleChange("age", v)}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            borderRadius: 8,
          }}
        />
      </View>

      {/* Gender */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 4, color: "#666" }}>Gender *</Text>
        <TextInput
          placeholder="Gender"
          value={formData.gender}
          onChangeText={(v) => handleChange("gender", v)}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 10,
            borderRadius: 8,
          }}
        />
      </View>

      <Button
        title={isLoading ? "Registering..." : "Register Donor"}
        onPress={handleRegister}
        disabled={isLoading}
      />
    </ScrollView>
  );
}
