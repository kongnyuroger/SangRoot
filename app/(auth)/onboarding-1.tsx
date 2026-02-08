import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Onboarding1Screen() {
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
          Welcome to SangRoot
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            color: "#666",
            lineHeight: 24,
          }}
        >
          The comprehensive blood donation management platform connecting
          doctors, hospitals, and blood banks.
        </Text>
      </View>

      <View style={{ width: "100%", marginTop: 40 }}>
        <Button
          title="Next"
          onPress={() => router.push("/(auth)/onboarding-2")}
          color="#e74c3c"
        />
      </View>

      <Text style={{ fontSize: 12, color: "#999", marginTop: 20 }}>1 of 3</Text>
    </View>
  );
}
