import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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

function CardButton({
  title,
  route,
  topColor,
  bottomColor,
  shadowColor,
  delay,
}: {
  title: string;
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
      Animated.spring(scaleAnim, {
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
  });

  const onPressIn = () =>
    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 30,
    }).start();

  const onPressOut = () =>
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }, { scale: pressAnim }],
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => router.push(route as any)}
      >
        <View
          style={[
            styles.cardOuter,
            { backgroundColor: shadowColor, borderColor: shadowColor },
          ]}
        >
          <View
            style={[
              styles.cardInner,
              { backgroundColor: topColor, borderColor: bottomColor },
            ]}
          >
            <View
              style={[styles.cardLedge, { backgroundColor: bottomColor }]}
            />
            <Text style={styles.cardLabel}>{title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Index() {
  const titleAnim = useRef(new Animated.Value(-60)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(titleAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [titleAnim, titleOpacity]);

  return (
    <ImageBackground
      source={require("../assets/images/BackGroundImage.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleAnim }],
            alignItems: "center",
          }}
        >
          <Text style={styles.title}> Ludo! </Text>
        </Animated.View>

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
  title: {
    fontSize: 72,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
  buttonContainer: {
    gap: 50,
    width: "100%",
    alignItems: "center",
    bottom:200,
  },
  cardOuter: {
    borderRadius: 20,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10,
  },
  cardInner: {
    borderRadius: 18,
    borderWidth: 2,
    borderTopColor: "rgba(255,255,255,0.4)",
    borderTopWidth: 2,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cardLedge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    opacity: 0.6,
  },
  cardLabel: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 1.5,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
