import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View className="flex-1 items-center justify-center bg-blue-500">
        <Text className="text-white text-xl font-bold">Hello NativeWind</Text>
      </View>
    </View>
  );
}
