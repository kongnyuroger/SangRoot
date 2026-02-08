import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { setOnboardingCompleted } from "../../src/lib/authStorage";

export default function Onboarding3Screen() {
  const router = useRouter();

  const handleGetStarted = async () => {
    // Mark onboarding as completed
    await setOnboardingCompleted();
    // Navigate to login
    router.replace("/(auth)/login");
  };

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
          Ready to Get Started?
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            color: "#666",
            lineHeight: 24,
          }}
        >
          Join doctors, hospitals, and blood banks in saving lives through
          efficient blood donation management.
        </Text>
      </View>

      <View style={{ width: "100%", marginTop: 40, gap: 12 }}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          color="#27ae60"
        />
        <Button title="Back" onPress={() => router.back()} color="#95a5a6" />
      </View>

      <Text style={{ fontSize: 12, color: "#999", marginTop: 20 }}>3 of 3</Text>
    </View>
  );
}
