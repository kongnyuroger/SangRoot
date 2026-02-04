import { Tabs } from "expo-router";

export default function HospitalAdminLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="request" options={{ title: "Request" }} />
      <Tabs.Screen
        name="register-donor"
        options={{ title: "Register Donor" }}
      />
      <Tabs.Screen
        name="invite-doctors"
        options={{ title: "Invite Doctors" }}
      />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
