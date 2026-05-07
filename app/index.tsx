import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Buttons = [
  { 
    title: "🤖 VS COMPUTER", 
    route: "/gameScreen",
    topColor: "lightblue",
    bottomColor: "blue",
    shadowColor: "rgba(0, 0, 255, 0.5)",  
  },
  { 
    title: "👩‍👩‍👧‍👦 VS PLAYER", 
    route: "/gameScreen",
    topColor: "lightgreen",
    bottomColor: "green",
    shadowColor: "rgba(0, 128, 0, 0.5)",
  },
  { 
    title: "⚙️ SETTINGS", 
    route: "/settingsScreen",
    topColor: "lightgray",
    bottomColor: "gray",
    shadowColor: "rgba(128, 128, 128, 0.5)",
  },
];

function CardButton({ label, route, topColor, bottomColor, shadowColor, delay }:{
  label: string;
  route: string;
  topColor: string;
  bottomColor: string;
  shadowColor: string;
  delay: number;
}) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim,{
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
        delay,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        delay,
      }),
    ]).start();
  },[]);

  const onPressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };
return (
  <Animated.View
    style={[opacityAnim, { transform: [{ scale},{scale:pressAnim }] }]}>
    <TouchableOpacity      
       activeOpacity={1}
       onPressIn={onPressIn}
       onPressOut={onPressOut}
       onPress={() => router.push(route as any)}>
        <View style={[styles.cardOuter,{backgroundColor:shadowColor,borderColor:shadowColor},]}>
        <View style={[styles.cardInner,{backgroundColor:bottomColor}]}>
        }]
        
       </TouchableOpacity>
    </Animated.View>
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Play Ludo!</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/gameScreen")}
        >
          <Text style={styles.buttonText}> 🤖 VS COMPUTER</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/gameScreen")}
        >
          <Text style={styles.buttonText}> 👩‍👩‍👧‍👦 VS PLAYER</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/settingsScreen")}
        >
          <Text style={styles.buttonText}> ⚙️ SETTINGS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 120,
    paddingBottom: 80,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
    marginTop: 200,
    letterSpacing: 1,
  },
  buttonContainer: {
    gap: 12,
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 180,
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: "80%",
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
