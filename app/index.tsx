import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function OnSplashScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>SangRoot</Text>
      <Text style={{ fontSize: 16, marginBottom: 24 }}>
        Choose how you want to log in
      </Text>

      <View style={{ width: "80%", gap: 12 }}>
        <Button
          title="Login as Doctor"
          onPress={() => router.push("/(auth)/doctor-login")}
        />
        <Button
          title="Login as Hospital Admin"
          onPress={() => router.push("/(auth)/hospital-admin-login")}
        />
        <Button
          title="Login as Blood Bank Admin"
          onPress={() => router.push("/(auth)/blood-bank-admin-login")}
        />
      </View>
    </View>
  );
}
