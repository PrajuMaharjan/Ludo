import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="gameScreen" />
      <Stack.Screen name="settingsScreen" />
      <Stack.Screen name="gameSettingsScreen" />
      <Stack.Screen name="advancedSettingsScreen" />
      <Stack.Screen name="WinnerScreen" />
    </Stack>
  );
}
