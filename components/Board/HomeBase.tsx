import { Animated,StyleSheet,Text, View } from "react-native";
import {useEffect,useRef} from "react";
import { HOME_BASE_POSITIONS } from "../../constants/GameConstants";
import { CELL_SIZE } from "../../constants/BoardConstants";
import Coin from "../Coin/Coin";
import {Player} from "../../store/GameContext";

type HomeBaseProps = {
  playerId: number;
  color: string;
  player: Player | undefined;
  isComputer:boolean;
  isActive:boolean;
};

const QUADRANT_ORIGINS: Record<number, [number, number]> = {
  0: [0, 0],
  1: [0, 9],
  2: [9, 9],
  3: [9, 0],
};

function darken(hex:string,amount:number):string{
  const num=parseInt(hex.replace("#",""),16);
  const r=Math.max(0,Math.floor(((num>>16) & 0xff)*(1-amount)));
  const g=Math.max(0,Math.floor(((num>>8) & 0xff)*(1-amount)));
  const b=Math.max(0,Math.floor((num & 0xff)*(1-amount)));

  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
};

export default function HomeBase({ playerId, color,player,isComputer ,isActive}: HomeBaseProps) {
  const [originRow, originCol] = QUADRANT_ORIGINS[playerId];
  const coinPositions = HOME_BASE_POSITIONS[playerId];

  const zoneSize = CELL_SIZE * 6;
  const top = originRow * CELL_SIZE;
  const left = originCol * CELL_SIZE;

  const coinSize = CELL_SIZE * 0.85;

  const darkColor=darken(color,0.35);

  const flashAnim=useRef(new Animated.Value(0)).current;

  useEffect(()=>{
    let loop:Animated.CompositeAnimation | null=null;
    if(isActive){
      loop=Animated.loop(Animated.sequence([
              Animated.timing(flashAnim,{
                toValue:1,
                duration:450,
                useNativeDriver:false,
              }),
              Animated.timing(flashAnim,{
                toValue:0,
                duration:450,
                useNativeDriver:false
              }),              
      ]),
      );
      loop.start();
    }else{
      flashAnim.setValue(0);
    }
    return()=>{
      loop?.stop();
    };
  },[isActive,flashAnim]);

  const animatedBackgroundColor=flashAnim.interpolate({
    inputRange:[0,1],
    outputRange:[darkColor,"#ffffff"],
  });

  const emptySlotStyle={
    width:coinSize,
    height:coinSize,
    borderRadius:coinSize/2,
    backgroundColor:"rgba(0,0,0,0.15)",
    borderWidth:1.5,
    borderColor:"rgba(0,0,0,0.2)",
  };

  return (
    <Animated.View
      style={[
        styles.zone,
        {
          top,
          left,
          width: zoneSize,
          height: zoneSize,
          backgroundColor: isActive ? animatedBackgroundColor:darkColor,
        },
      ]}
    >
      <View style={styles.innerCard}>
        <View style={[styles.coinBox, { borderColor: color}]}>
          <View style={styles.coinGrid}>
            
            <View style={styles.coinRow}>
              {coinPositions.slice(0, 2).map((_, index) => player ? (
                <Coin key={`${playerId}-coin-${index}`}
                      color={color}
                      size={coinSize}
                      isSelected={false}
                      isComputer={isComputer}
                      disabled={true}
                />
              ):(
                <View key={`${playerId}-empty-${index}`} style={emptySlotStyle} />
              )
              )}
            </View>

            <View style={styles.coinRow}>
              {coinPositions.slice(2, 4).map((_, index) => player ? (
                <Coin key={`${playerId}-coin-${index+2}`}
                      color={color}
                      size={coinSize}
                      isSelected={false}
                      isComputer={isComputer}
                      disabled={true}
                />
              ):(
                <View key={`${playerId}-empty-${index}`} style={emptySlotStyle} />
              )
              )}
            </View>

          </View>
        </View>
        {/* Player Name below HomeBase */}
        {player &&(
          <Text style={styles.playerName} numberOfLines={1}>
            {player.name}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  zone: {
    position: "absolute",
    borderRadius: 4,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.4)",
  },
  innerCard: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    gap:4,
  },
  coinBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 6,
    borderWidth: 2.5,
  },
  coinGrid: {
    gap: 6,
    alignItems: "center",
  },
  coinRow: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  playerName:{
    fontSize:11,
    fontWeight:"bold",
    color:"#ffffff",
    textShadowColor:"rgba(0,0,0,0.6)",
    textShadowOffset:{width:0,height:1},
    textShadowRadius:2,
    maxWidth:"90%",
  }
});