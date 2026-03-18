import { useRouter } from "expo-router";
import { Alert } from "react-native";
import RegisterDonorScreen from "@/src/components/RegisterDonorScreen";
import { registerDonor } from "@/src/services/donor.service";

export default function DoctorRegisterDonorScreen() {
  const router = useRouter();
  return (
    <RegisterDonorScreen
      registeredBy="Doctor"
      registerDonor={registerDonor}
      onSuccess={() => {
        Alert.alert("Success", "Donor registered successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }}
    />
  );
}
