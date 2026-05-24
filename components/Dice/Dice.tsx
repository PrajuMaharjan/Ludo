import { useCallback, useEffect, useRef, useState } from "react";
import {useAudioPlayer} from "expo-audio";
import { Dimensions,PanResponder,StyleSheet,View} from "react-native";
import Animated,{useAnimatedStyle,useSharedValue,withTiming} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const DICE_SIZE = 64;
const FRICTION = 0.97;
const STOP_THRESHOLD = 0.8;
const ROTATION_SPEED= 3;

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [25, 25],
    [75, 75],
  ],
  3: [
    [25, 25],
    [50, 50],
    [75, 75],
  ],
  4: [
    [25, 25],
    [25, 75],
    [75, 25],
    [75, 75],
  ],
  5: [
    [25, 25],
    [25, 75],
    [50, 50],
    [75, 25],
    [75, 75],
  ],
  6: [
    [25, 25],
    [25, 75],
    [50, 25],
    [50, 75],
    [75, 25],
    [75, 75],
  ],
};

function DiceFace({ value, size }: { value: number; size: number }) {
  const dots = DOT_POSITIONS[value] ?? DOT_POSITIONS[1];
  const dotSize = size * 0.16;

  return (
    <View
      style={[
        styles.face,
        { width: size, height: size, borderRadius: size * 0.18 },
      ]}
    >
      {dots.map(([top, left], i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              top: `${top}%` as any,
              left: `${left}%` as any,
              marginTop: -(dotSize / 2),
              marginLeft: -(dotSize / 2),
            },
          ]}
        />
      ))}
    </View>
  );
}

type DiceProps = {
  onRoll: (result: number) => void;
  isComputerTurn: boolean;
  disabled: boolean;
};

export default function Dice({ onRoll, isComputerTurn, disabled }: DiceProps) {
  const [face, setFace] = useState(1);

  // Function for sound while rolling
  const player=useAudioPlayer(require("../../assets/sounds/dice_roll.wav"));

  const posX = useRef(SCREEN_WIDTH / 2 - DICE_SIZE / 2);
  const posY = useRef(SCREEN_HEIGHT - DICE_SIZE - 140);

  const velX = useRef(0);
  const velY = useRef(0);

  const animRef = useRef<number | null>(null);
  const rollingRef = useRef(false);

  const translateX=useSharedValue(posX.current);
  const translateY=useSharedValue(posY.current);
  const rotateX=useSharedValue(0);
  const rotateY=useSharedValue(0);
  const rotateZ=useSharedValue(0);
  const scale=useSharedValue(1);

  const rotXDeg=useRef(0);
  const rotYDeg=useRef(0);
  const rotZDeg=useRef(0);

  const animStyle=useAnimatedStyle(()=>({
    transform:[
      {translateX:translateX.value},
      {translateY:translateY.value},
      {perspective:400},
      {rotateX:`${rotateX.value}deg`},
      {rotateY:`${rotateY.value}deg`},
      {rotateZ:`${rotateZ.value}deg`},
      {scale:scale.value},
    ],
  }));


  const startPhysics = useCallback(
    (vx: number, vy: number) => {
      if (rollingRef.current) return;
      rollingRef.current = true;
      player.seekTo(0);
      player.play();

      velX.current = vx;
      velY.current = vy;

      const tick = () => {
        velX.current *= FRICTION;
        velY.current *= FRICTION;

        posX.current += velX.current;
        posY.current += velY.current;

        // Bouncing logic
        if (posX.current <= 0) {
          posX.current = 0;
          velX.current = Math.abs(velX.current);
        }
        if (posX.current >= SCREEN_WIDTH - DICE_SIZE) {
          posX.current = SCREEN_WIDTH - DICE_SIZE;
          velX.current = -Math.abs(velX.current);
        }
        if (posY.current <= 0) {
          posY.current = 0;
          velY.current = Math.abs(velY.current);
        }
        if (posY.current >= SCREEN_HEIGHT - DICE_SIZE) {
          posY.current = SCREEN_HEIGHT - DICE_SIZE;
          velY.current = -Math.abs(velY.current);
        }

        // Rotation logic
        const speed = Math.sqrt(velX.current ** 2 + velY.current ** 2);
        rotXDeg.current+=velY.current*ROTATION_SPEED;
        rotYDeg.current-=velX.current*ROTATION_SPEED;
        rotZDeg.current+=speed*0.5;
        rotateX.value=rotXDeg.current;
        rotateY.value=rotYDeg.current;
        rotateZ.value=rotZDeg.current;
        scale.value=1+Math.sin(rotZDeg.current*0.08)*0.06;
        translateX.value=posX.current;
        translateY.value=posY.current;

        // Stopping logic
        if (speed < STOP_THRESHOLD) {
          player.pause();
          const result = Math.ceil(Math.random() * 6);
          setFace(result);
          rollingRef.current = false;

          // Showing result of roll
          rotateX.value=withTiming(Math.round(rotXDeg.current/90)*90,{duration:200});
          rotateY.value=withTiming(Math.round(rotYDeg.current/90)*90,{duration:200});
          rotateZ.value=withTiming(Math.round(rotZDeg.current/90)*90,{duration:200});
          scale.value=withTiming(1,{duration:200});

          onRoll(result);
          return;
        }
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    },
    [onRoll, player, translateX,translateY,rotateX,rotateY,rotateZ,scale]
  );

  // Remembering position for subsequent rolls
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const lastVel = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled && !rollingRef.current,
      onMoveShouldSetPanResponder: () => !disabled && !rollingRef.current,

      onPanResponderGrant: (e) => {
        lastPos.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
        lastTime.current = Date.now();
        lastVel.current = { x: 0, y: 0 };
        if (animRef.current) cancelAnimationFrame(animRef.current);
      },
      onPanResponderMove: (e) => {
        const now = Date.now();
        const dt = Math.max(now - lastTime.current, 1);
        const dx = e.nativeEvent.pageX - lastPos.current.x;
        const dy = e.nativeEvent.pageY - lastPos.current.y;

        lastVel.current = {
          x: (dx / dt) * 16,
          y: (dy / dt) * 16,
        };

        posX.current = e.nativeEvent.pageX - DICE_SIZE / 2;
        posY.current = e.nativeEvent.pageY - DICE_SIZE / 2;
        translateX.value=posX.current;
        translateY.value=posX.current;

        lastPos.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
        lastTime.current = now;
      },

      onPanResponderRelease: () => {
        startPhysics(lastVel.current.x, lastVel.current.y);
      },
    }),
  ).current;

  // CPU rolling logic
  useEffect(() => {
    if (!isComputerTurn || disabled || rollingRef.current) return;

    const timer = setTimeout(() => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 8 + Math.random() * 8;
      startPhysics(Math.cos(angle) * speed, Math.sin(angle) * speed);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isComputerTurn, disabled, startPhysics]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Rendering the dice
  return (
    <Animated.View
      style={[styles.diceWrapper,animStyle]}
             {...panResponder.panHandlers}
    >
      <DiceFace value={face} size={DICE_SIZE} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  diceWrapper: {
    position: "absolute",
    width: DICE_SIZE,
    height: DICE_SIZE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  face: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.15)",
    position: "relative",
  },
  dot: {
    position: "absolute",
    backgroundColor: "#1a0a2e",
  },
});
