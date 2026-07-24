import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {Animated,StyleSheet,Text,TouchableOpacity,View} from "react-native";

type CardButtonProps={
  title: string;
  route: string;
  topColor: string;
  bottomColor: string;
  shadowColor: string;
  delay: number;
};

export default function CardButton({
  title,
  route,
  topColor,
  bottomColor,
  shadowColor,
  delay,
}: CardButtonProps) {
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

const styles=StyleSheet.create({
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
    }
});