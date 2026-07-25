import {ImageBackground,StyleSheet,View} from "react-native";
import CardButton from "../components/common/CardButton";
import AppTitle from "../components/common/AppTitle";

const Buttons = [
  {
    title: "🎲 Play Ludo",
    route: "/gameSettingsScreen",
    topColor: "#f5c842",
    bottomColor: "#c98f10",
    shadowColor: "#996800",
  },
  {
    title: "⚙️ SETTINGS",
    route: "/settingsScreen",
    topColor: "#72e86a",
    bottomColor: "#3aaa32",
    shadowColor: "#1f7a1a",
  },
];

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require("../assets/images/BackGroundImage.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <AppTitle title=" Ludo! " />

        {/* Three buttons */}
        <View style={styles.buttonContainer}>
          {Buttons.map((btn, i) => (
            <CardButton key={btn.title} {...btn} delay={i * 120 + 200} />
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,20,60,0.50)",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 120,
    paddingBottom: 80,
  },
  buttonContainer: {
    gap: 50,
    width: "100%",
    alignItems: "center",
    bottom:200,
  }
});