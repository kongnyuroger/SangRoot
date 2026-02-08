import { useRouter } from "expo-router";
import React from "react";
import { Alert, Button, ScrollView, Text, TextInput, View } from "react-native";
import { useLogin } from "../../src/hooks/useAuthHooks";
import { getAccessToken } from "../../src/lib/authStorage";
import { getTokenRole } from "../../src/lib/tokenUtils";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const mutation = useLogin();

  const handleLogin = async () => {
    try {
      await mutation.mutateAsync({ email, password });

      // Get user role from token and navigate accordingly
      const token = await getAccessToken();
      const role = token ? getTokenRole(token) : null;

      if (role === "DOCTOR") {
        router.replace("/(doctor)/request");
      } else if (role === "HOSPITAL") {
        router.replace("/(hospital-admin)/register-donor");
      } else if (role === "BLOOD_BANK") {
        router.replace("/(blood-bank-admin)/register-donor");
      } else {
        // Fallback to home
        router.replace("/");
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      Alert.alert("Login failed", errorMessage);
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
          Login to SangRoot
        </Text>

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
            placeholder="Enter your password"
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
          title={mutation.isLoading ? "Logging in..." : "Login"}
          onPress={handleLogin}
          disabled={mutation.isLoading}
          color="#e74c3c"
        />

        <View style={{ height: 16 }} />

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#eee",
            paddingTop: 16,
            marginTop: 16,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "#666", marginBottom: 12 }}
          >
            Don't have an account?
          </Text>
          <Button
            title="Create Account"
            onPress={() => router.push("/(auth)/register")}
            color="#3498db"
          />
        </View>

        <View style={{ height: 12 }} />

        <View
          style={{ borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 16 }}
        >
          <Text
            style={{ textAlign: "center", color: "#666", marginBottom: 12 }}
          >
            Have an invite code?
          </Text>
          <Button
            title="Accept Invite"
            onPress={() => router.push("/(auth)/accept-invite")}
            color="#27ae60"
          />
        </View>
      </View>
    </ScrollView>
  );
}

/*
  return (
    <ScrollView contentContainerStyle={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <View>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 24, textAlign: "center" }}>Login to SangRoot</Text>
        
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>Email</Text>
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
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>Password</Text>
          <TextInput
            placeholder="Enter your password"
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
          title={mutation.isLoading ? "Logging in..." : "Login"}
          onPress={handleLogin}
          disabled={mutation.isLoading}
          color="#e74c3c"
        />

        <View style={{ height: 16 }} />

        <View style={{ borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 16, marginTop: 16 }}>
          <Text style={{ textAlign: "center", color: "#666", marginBottom: 12 }}>Don't have an account?</Text>
          <Button
            title="Create Account"
            onPress={() => router.push("/(auth)/register")}
            color="#3498db"
          />
        </View>

        <View style={{ height: 12 }} />

        <View style={{ borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 16 }}>
          <Text style={{ textAlign: "center", color: "#666", marginBottom: 12 }}>Have an invite code?</Text>
          <Button
            title="Accept Invite"
            onPress={() => router.push("/(auth)/accept-invite")}
            color="#27ae60"
          />
        </View>
      </View>
    </ScrollView>
  );
}

  return (
    <ScrollView contentContainerStyle={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <View>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 24, textAlign: "center" }}>Login to SangRoot</Text>
        
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>Email</Text>
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
          <Text style={{ fontSize: 12, marginBottom: 4, color: "#666" }}>Password</Text>
          <TextInput
            placeholder="Enter your password"
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
          title={mutation.isLoading ? "Logging in..." : "Login"}
          onPress={handleLogin}
          disabled={mutation.isLoading}
          color="#e74c3c"
        />

        <View style={{ height: 16 }} />

        <View style={{ borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 16, marginTop: 16 }}>
          <Text style={{ textAlign: "center", color: "#666", marginBottom: 12 }}>Don't have an account?</Text>
          <Button
            title="Create Account"
            onPress={() => router.push("/(auth)/register")}
            color="#3498db"
          />
        </View>

        <View style={{ height: 12 }} />

        <View style={{ borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 16 }}>
          <Text style={{ textAlign: "center", color: "#666", marginBottom: 12 }}>Have an invite code?</Text>
          <Button
            title="Accept Invite"
            onPress={() => router.push("/(auth)/accept-invite")}
            color="#27ae60"
          />
        </View>
      </View>
    </ScrollView>
  );
}
*/
