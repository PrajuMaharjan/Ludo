import { Stack } from "expo-router";
import { ImageBackground, StyleSheet } from "react-native";
import { GameProvider } from "../store/GameContext";

export default function RootLayout() {
  return (
    <GameProvider>
      <ImageBackground
        source={require("../assets/images/BackGroundImage.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right", contentStyle:{backgroundColor:'transparent'}}}
        >
          <Stack.Screen name="homeScreen" />
          <Stack.Screen name="gameScreen" />
          <Stack.Screen name="settingsScreen" />
          <Stack.Screen name="gameSettingsScreen" />
          <Stack.Screen name="advancedSettingsScreen" />
          <Stack.Screen name="WinnerScreen" />
        </Stack>
      </ImageBackground>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a143c",
  }
});
