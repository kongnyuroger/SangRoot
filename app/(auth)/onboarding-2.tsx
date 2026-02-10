import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Onboarding2Screen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <View style={{ marginBottom: 40 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          Manage Blood Requests
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            color: "#666",
            lineHeight: 24,
          }}
        >
          Doctors can easily request blood units and hospitals can manage
          inventory efficiently.
        </Text>
      </View>

      <View style={{ width: "100%", marginTop: 40, gap: 12 }}>
        <Button
          title="Next"
          onPress={() => router.push("/(auth)/onboarding-3")}
          color="#e74c3c"
        />
        <Button title="Back" onPress={() => router.back()} color="#95a5a6" />
      </View>

      <Text style={{ fontSize: 12, color: "#999", marginTop: 20 }}>2 of 3</Text>
    </View>
  );
}
