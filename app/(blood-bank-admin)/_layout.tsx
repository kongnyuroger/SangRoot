import { Tabs } from "expo-router";

export default function BloodBankAdminLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="register-donor"
        options={{ title: "Register Donor" }}
      />
      <Tabs.Screen name="activity" options={{ title: "Activity" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
