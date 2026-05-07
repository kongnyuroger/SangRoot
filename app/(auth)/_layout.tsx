import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../src/constants/theme";

function CompactHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        height: insets.top + 8,
        backgroundColor: colors.background,
      }}
    />
  );
}

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <CompactHeader />,
        headerTitle: "",
        headerBackTitle: "",
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerBackVisible: false,
      }}
    />
  );
}
