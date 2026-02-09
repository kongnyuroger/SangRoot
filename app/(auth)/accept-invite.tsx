import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Button, ScrollView, Text, TextInput, View } from "react-native";
import * as authService from "../../src/services/auth.service";

export default function AcceptInviteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const inviteId = (params.inviteId as string) || "";

  const [formData, setFormData] = React.useState({
    inviteId: inviteId,
    name: "",
    email: "",
    password: "",
    phone: "",
    registrationNo: "",
    specialization: "",
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAcceptInvite = async () => {
    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "password",
      "phone",
      "registrationNo",
      "specialization",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData],
    );

    if (emptyFields.length > 0) {
      Alert.alert(
        "Required Fields",
        `Please fill in: ${emptyFields.join(", ")}`,
      );
      return;
    }

    if (formData.password.length < 8) {
      Alert.alert("Password Error", "Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      await authService.acceptInvite({
        inviteId: formData.inviteId,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        registrationNo: formData.registrationNo,
        specialization: formData.specialization,
      });

      Alert.alert("Success", "Account created successfully! Logging you in...");
      // Navigate to doctor dashboard
      router.replace("/(doctor)/request");
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to accept invite";
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
          Accept Invite
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#666",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Complete your doctor registration
        </Text>

        {/* Full Name */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            Full Name *
          </Text>
          <TextInput
            placeholder="Enter your full name"
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

        {/* Email */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            Email *
          </Text>
          <TextInput
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 12,
              borderRadius: 8,
              fontSize: 16,
            }}
          />
        </View>

        {/* Password */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            Password *
          </Text>
          <TextInput
            placeholder="Create a password (min 8 characters)"
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry
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
            Phone Number *
          </Text>
          <TextInput
            placeholder="Enter your phone number"
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

        {/* Registration Number */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            Medical Registration Number *
          </Text>
          <TextInput
            placeholder="Enter your registration number"
            value={formData.registrationNo}
            onChangeText={(value) => handleInputChange("registrationNo", value)}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 12,
              borderRadius: 8,
              fontSize: 16,
            }}
          />
        </View>

        {/* Specialization */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            Specialization *
          </Text>
          <TextInput
            placeholder="Enter your medical specialization"
            value={formData.specialization}
            onChangeText={(value) => handleInputChange("specialization", value)}
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
          title={isLoading ? "Creating Account..." : "Accept Invite & Register"}
          onPress={handleAcceptInvite}
          disabled={isLoading}
          color="#27ae60"
        />

        <View style={{ height: 12 }} />

        <Button
          title="Back to Login"
          onPress={() => router.back()}
          color="#95a5a6"
        />
      </View>
    </ScrollView>
  );
}
