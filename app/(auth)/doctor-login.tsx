import { useRouter } from "expo-router";
import React from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { useLogin } from "../../src/hooks/useAuthHooks";

export default function DoctorLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const mutation = useLogin();

  const handleLogin = async () => {
    try {
      await mutation.mutateAsync({ email, password });
      // after successful login, navigate to root (app will fetch profile)
      router.replace("/");
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      Alert.alert("Login failed", errorMessage);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Doctor Login
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />
      <Button
        title={mutation.isLoading ? "Logging in..." : "Login"}
        onPress={handleLogin}
      />
      <View style={{ height: 12 }} />
      <Button
        title="Register"
        onPress={() => router.push("/(auth)/register")}
      />
    </View>
  );
}
