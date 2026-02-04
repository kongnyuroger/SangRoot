import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function HospitalAdminLoginScreen() {
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
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Hospital Admin Login (placeholder)
      </Text>
      <Button
        title="Continue to Hospital Admin app"
        onPress={() => router.push("/(hospital-admin)/request")}
      />
    </View>
  );
}
