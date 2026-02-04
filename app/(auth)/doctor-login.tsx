import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function DoctorLoginScreen() {
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
        Doctor Login (placeholder)
      </Text>
      <Button
        title="Continue to Doctor app"
        onPress={() => router.push("/(doctor)/request")}
      />
    </View>
  );
}
