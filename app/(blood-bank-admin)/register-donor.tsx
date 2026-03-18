import { useRouter } from "expo-router";
import { Alert } from "react-native";
import RegisterDonorScreen from "@/src/components/RegisterDonorScreen";
import { registerDonor } from "@/src/services/donor.service";

export default function BloodBankRegisterDonorScreen() {
  const router = useRouter();
  return (
    <RegisterDonorScreen
      registeredBy="Blood Bank"
      registerDonor={registerDonor}
      onSuccess={() => {
        Alert.alert("Success", "Donor registered successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }}
    />
  );
}
