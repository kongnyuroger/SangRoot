import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { AuthCard } from "../../src/components/auth/AuthCard";
import { AuthHeader } from "../../src/components/auth/AuthHeader";
import { StyledButton } from "../../src/components/auth/StyledButton";
import { StyledInput } from "../../src/components/auth/StyledInput";
import { colors, spacing } from "../../src/constants/theme";
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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          icon="medical-outline"
          title="Accept Invite"
          subtitle="Complete your doctor registration"
        />

        <AuthCard>
          <StyledInput
            label="Full Name *"
            icon="person-outline"
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
          />

          <StyledInput
            label="Email *"
            icon="mail-outline"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <StyledInput
            label="Password *"
            icon="lock-closed-outline"
            placeholder="Create a password (min 8 characters)"
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry
          />

          <StyledInput
            label="Phone Number *"
            icon="call-outline"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            keyboardType="phone-pad"
          />

          <StyledInput
            label="Medical Registration Number *"
            icon="card-outline"
            placeholder="Enter your registration number"
            value={formData.registrationNo}
            onChangeText={(value) => handleInputChange("registrationNo", value)}
          />

          <StyledInput
            label="Specialization *"
            icon="fitness-outline"
            placeholder="Enter your medical specialization"
            value={formData.specialization}
            onChangeText={(value) => handleInputChange("specialization", value)}
          />

          <StyledButton
            title={
              isLoading ? "Creating Account..." : "Accept Invite & Register"
            }
            onPress={handleAcceptInvite}
            loading={isLoading}
            disabled={isLoading}
          />

          <View style={styles.divider} />

          <StyledButton
            title="Back to Login"
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
