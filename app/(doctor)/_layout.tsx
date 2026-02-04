import { Tabs } from "expo-router";

export default function DoctorLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="request" options={{ title: "Request" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
