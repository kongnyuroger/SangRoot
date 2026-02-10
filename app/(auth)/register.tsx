import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Button,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRegister } from "../../src/hooks/useAuthHooks";

type UserRole = "DOCTOR" | "HOSPITAL" | "BLOOD_BANK";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null);
  const mutation = useRegister();

  const roles: { value: UserRole; label: string; description: string }[] = [
    // Doctor role removed - must use invite

    {
      value: "HOSPITAL",
      label: "Hospital",
      description: "Register as a hospital administrator",
    },
    {
      value: "BLOOD_BANK",
      label: "Blood Bank",
      description: "Register as a blood bank administrator",
    },
  ];

  const handleRegister = async () => {
    if (!selectedRole) {
      Alert.alert("Role Required", "Please select a role");
      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert("Required Fields", "Please fill in all fields");
      return;
    }

    try {
      await mutation.mutateAsync({ email, password, role: selectedRole });
      // after register, go to complete profile with role parameter
      router.push({
        pathname: "/(auth)/complete-profile",
        params: { role: selectedRole },
      });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      Alert.alert("Registration failed", errorMessage);
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
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Create Account
        </Text>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 12 }}>
            Select Your Role
          </Text>
          <View style={{ gap: 12 }}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.value}
                onPress={() => setSelectedRole(role.value)}
                style={{
                  borderWidth: 2,
                  borderColor: selectedRole === role.value ? "#e74c3c" : "#ddd",
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor:
                    selectedRole === role.value ? "#ffe0d6" : "#fff",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: selectedRole === role.value ? "#e74c3c" : "#333",
                  }}
                >
                  {role.label}
                </Text>
                <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                  {role.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            Email
          </Text>
          <TextInput
            placeholder="Enter your email"
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

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>
            Password
          </Text>
          <TextInput
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
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

        <Button
          title={mutation.isLoading ? "Creating Account..." : "Register"}
          onPress={handleRegister}
          disabled={mutation.isLoading || !selectedRole}
          color="#27ae60"
        />

        <View style={{ height: 12 }} />

        <Button
          title="Back to Login"
          onPress={() => router.push("/(auth)/login")}
          color="#95a5a6"
        />
      </View>
    </ScrollView>
  );
}
