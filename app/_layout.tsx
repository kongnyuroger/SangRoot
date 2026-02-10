import { Stack } from "expo-router";
import "../global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../src/lib/queryClient";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
}
