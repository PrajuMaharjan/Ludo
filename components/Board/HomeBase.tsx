import { HOME_BASE_POSITIONS } from "../../constants/GameConstants";
import { CELL_SIZE } from "./Board";
import {StyleSheet,View} from "react-native";

type HomeBaseProps = {
  playerId: number;
  color: string;
};

const QUADRANT_ORIGINS: Record<number, [number, number]> = {
  0: [1, 1],
  1: [1, 9],
  2: [9, 9],
  3: [9, 1],
};

export default function HomeBase({ playerId, color }: HomeBaseProps) {
  const [originRow, originCol] = QUADRANT_ORIGINS[playerId];
  const coinPositions = HOME_BASE_POSITIONS[playerId];

  const zoneSize = CELL_SIZE * 5;
  const top = originRow * CELL_SIZE;
  const left = originCol * CELL_SIZE;

  const coinSize = CELL_SIZE * 0.65;

  return (
    <View
      style={[
        styles.zone,
        {
          top,
          left,
          width: zoneSize,
          height: zoneSize,
          backgroundColor: color,
        },
      ]}
    >
      <View style={styles.innerCard}>
        <View style={styles.coinGrid}>

        <View style={styles.coinRow}>
          {coinPositions.slice(0,2).map((_, index) => (
            <View
              key={index}
              style={[
                styles.coinSlot,
                {
                  width: coinSize,
                  height: coinSize,
                  borderRadius: coinSize / 2,
                  borderColor: color,
                },
              ]}
            >

              {/* COIN PLACEHOLDER : COIN WILL BE BUILT LATER*/}
              <View
                style={[
                  styles.coinFill,
                  {
                    width: coinSize * 0.7,
                    height: coinSize * 0.7,
                    borderRadius: (coinSize * 0.7) / 2,
                    backgroundColor: color,
                  },
                ]}
              />
            </View>
          ))}
        </View>

        <View style={styles.coinRow}>
          {coinPositions.slice(2,4).map((_, index) => (
            <View
              key={index}
              style={[
                styles.coinSlot,
                {
                  width: coinSize,
                  height: coinSize,
                  borderRadius: coinSize / 2,
                  borderColor: color,
                },
              ]}
            >

              {/* COIN PLACEHOLDER : COIN WILL BE BUILT LATER*/}
              <View
                style={[
                  styles.coinFill,
                  {
                    width: coinSize * 0.7,
                    height: coinSize * 0.7,
                    borderRadius: (coinSize * 0.7) / 2,
                    backgroundColor: color,
                  },
                ]}
              />
            </View>
          ))}

      </View>
    </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  zone: {
    position: "absolute",
    borderRadius: 6,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCard: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  coinGrid: {
    gap:6,
    alignItems:"center",
  },
  coinSlot: {
    width:"45%",
    aspectRatio:1,
    borderWidth: 2.5,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  coinFill: {
    opacity: 0.6,
  },
  coinRow:{
    flexDirection:"row",
    gap:6,
    justifyContent:"center",
  }
});
