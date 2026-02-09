import React, { useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, View } from "react-native";
import { inviteDoctor } from "../../src/services/hospital.service";

export default function HospitalAdminInviteDoctorsScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) {
      Alert.alert("Required", "Please enter an email address");
      return;
    }

    setIsLoading(true);
    try {
      await inviteDoctor({ email });
      Alert.alert("Success", "Invitation sent successfully!");
      setEmail("");
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to send invitation";
      Alert.alert("Error", message);
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
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Invite Doctor
        </Text>

        <Text style={{ marginBottom: 16, textAlign: "center", color: "#666" }}>
          Send an invitation email to a doctor to join your hospital.
        </Text>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            Doctor's Email
          </Text>
          <TextInput
            placeholder="Enter doctor's email"
            value={email}
            onChangeText={setEmail}
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

        <Button
          title={isLoading ? "Sending..." : "Send Invitation"}
          onPress={handleInvite}
          disabled={isLoading}
          color="#27ae60"
        />
      </View>
    </ScrollView>
  );
}
