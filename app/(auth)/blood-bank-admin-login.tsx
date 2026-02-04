import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function BloodBankAdminLoginScreen() {
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
        Blood Bank Admin Login (placeholder)
      </Text>
      <Button
        title="Continue to Blood Bank Admin app"
        onPress={() => router.push("/(blood-bank-admin)/register-donor")}
      />
    </View>
  );
}
