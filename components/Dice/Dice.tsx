import { useAudioPlayer } from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet, View } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const DICE_SIZE = 64;
const FRICTION = 0.97;
const STOP_DURATION = 1500;
const ROTATION = 3;

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25],[75, 75]],
  3: [[25, 25],[50, 50],[75, 75]],
  4: [[25, 25],[25, 75],[75, 25],[75, 75]],
  5: [[25, 25],[25, 75],[50, 50],[75, 25],[75, 75]],
  6: [[25, 25],[25, 75],[50, 25],[50, 75],[75, 25],[75, 75]],
};

function DiceFace({value,size,isRolling}:{
  value: number;
  size: number;
  isRolling: boolean;
}) {
  const dots = DOT_POSITIONS[value] ?? DOT_POSITIONS[1];
  const dotSize = size * 0.16;

  return(
    <View style={[styles.face,{width:size,height:size,borderRadius:size*0.18}]}>
        {dots.map(([top,left],i)=>(
          <View key={i}
                style={[styles.dot,{
                        width:dotSize,
                        height:dotSize,
                        borderRadius:dotSize/2,
                        top:`${top}%` as any,
                        left:`${left}%` as any,
                        marginTop:-(dotSize/2),
                        marginLeft:-(dotSize/2)
                }]}
          />
        ))}
    </View>
  );
}

type DiceProps = {
  onRoll: (result: number) => void;
  isComputerTurn: boolean;
  disabled: boolean;
  currentPlayerId:number;
};

export default function Dice({ onRoll, isComputerTurn, disabled ,currentPlayerId}: DiceProps) {
  const [face, setFace] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const disabledRef=useRef(disabled);
  disabledRef.current=disabled;

  const player = useAudioPlayer(require("../../assets/sounds/dice_roll.wav"));

  const posX = useRef(SCREEN_WIDTH / 2 - DICE_SIZE / 2);
  const posY = useRef(SCREEN_HEIGHT - DICE_SIZE - 140);
  const animPos = useRef(
    new Animated.ValueXY({
      x: posX.current,
      y: posY.current,
    }),
  ).current;

  // Actual rotation
  const rotationZ = useRef(new Animated.Value(0)).current;
  const rotationZDeg = useRef(0);

  // Rotation simulation
  const skewX = useRef(new Animated.Value(0)).current;
  const skewY = useRef(new Animated.Value(0)).current;

  // Depth illusion
  const scalePulse = useRef(new Animated.Value(1)).current;

  const velX = useRef(0);
  const velY = useRef(0);

  const animRef = useRef<number | null>(null);
  const rollingRef = useRef(false);

  const shouldStopRef=useRef(false);
  const faceIntervalRef=useRef<ReturnType<typeof setInterval> | null>(null);


  const startPhysics = useCallback(
    (vx: number, vy: number) => {
      if (rollingRef.current) return;
      rollingRef.current = true;
      shouldStopRef.current=false;
      setIsRolling(true);

      player.seekTo(0);
      player.play();

      const inputSpeed=Math.sqrt(vx**2+vy**2);
      const angle=inputSpeed>0.5 ? Math.atan2(vy,vx) : Math.random()*Math.PI*2;
      
      const isTap=inputSpeed<0.5;
      if(isTap){
        velX.current=0;
        velY.current=0;
      }else{
      velX.current = Math.cos(angle)*inputSpeed;
      velY.current = Math.sin(angle)*inputSpeed;
      }
      faceIntervalRef.current=setInterval(()=>{
        setFace(Math.ceil(Math.random()*6));
      },80);

      const stopTimer=setTimeout(()=>{
        shouldStopRef.current=true;
      },STOP_DURATION);

      const tick = () => {

        if(shouldStopRef.current){
            if(faceIntervalRef.current){
              clearInterval(faceIntervalRef.current);
              faceIntervalRef.current=null;
            }

            const result=Math.ceil(Math.random()*6);
            setFace(result);
            setIsRolling(false);
            rollingRef.current=false;

            rotationZ.setValue(0);
            rotationZDeg.current=0;
            skewX.setValue(0);
            skewY.setValue(0);
            scalePulse.setValue(1);

            player.pause();
            onRoll(result);
            return;
        }

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
        rotationZDeg.current += (speed * ROTATION)+100;
        rotationZ.setValue(rotationZDeg.current);

        // Tilt effect to simulate rotation
        const skewXVal = Math.max(-25, Math.min(25, velY.current * 2));
        const skewYVal = Math.max(-25, Math.min(25, -velX.current * 2));
        skewX.setValue(skewXVal);
        skewY.setValue(skewYVal);
        scalePulse.setValue(1+Math.sin(rotationZDeg.current*0.08)*0.07);

        animPos.setValue({ x: posX.current, y: posY.current });
        animRef.current=requestAnimationFrame(tick);
      };
      animRef.current=requestAnimationFrame(tick);

      return ()=>clearTimeout(stopTimer);
    },
    [onRoll, animPos, rotationZ, skewX, skewY, scalePulse, player],
  );

  // Remembering position for subsequent rolls
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const lastVel = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current && !rollingRef.current,
      onMoveShouldSetPanResponder: () => !disabledRef && !rollingRef.current,

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
        animPos.setValue({ x: posX.current, y: posY.current });

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
    if (!isComputerTurn || rollingRef.current ) return;

    const timer = setTimeout(() => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 8 + Math.random() * 8;
      startPhysics(Math.cos(angle) * speed, Math.sin(angle) * speed);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isComputerTurn, startPhysics,currentPlayerId]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if(faceIntervalRef.current) clearInterval(faceIntervalRef.current);
    };
  }, []);

  // Rendering the dice
  const rotateInterpolate = rotationZ.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
    extrapolate: "extend",
  });

  const skewXInterpolate = skewX.interpolate({
    inputRange: [-25, 25],
    outputRange: ["-25deg", "25deg"],
  });
  const skewYInterpolate = skewY.interpolate({
    inputRange: [-25, 25],
    outputRange: ["-25deg", "25deg"],
  });

  return (
    // Outer
    <Animated.View
      style={[
        styles.diceWrapper,
        {
          transform: [{ translateX: animPos.x }, { translateY: animPos.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Inner(Pseudo 3d using rotation,skew and scale) */}
      <Animated.View
        style={{
          width: DICE_SIZE,
          height: DICE_SIZE,
          transform: [
            { rotate: rotateInterpolate },
            { skewX: skewXInterpolate },
            { skewY: skewYInterpolate },
            { scaleX: scalePulse },
            { scaleY: scalePulse },
          ],
        }}
      >
        <DiceFace value={face} size={DICE_SIZE} isRolling={isRolling} />
      </Animated.View>
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
