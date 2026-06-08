import { StyleSheet, View } from "react-native";
import { HOME_BASE_POSITIONS } from "../../constants/GameConstants";
import { CELL_SIZE } from "../../constants/BoardConstants";
import Coin from "../Coin/Coin";

type HomeBaseProps = {
  playerId: number;
  color: string;
};

const QUADRANT_ORIGINS: Record<number, [number, number]> = {
  0: [0, 0],
  1: [0, 9],
  2: [9, 9],
  3: [9, 0],
};

export default function HomeBase({ playerId, color }: HomeBaseProps) {
  const [originRow, originCol] = QUADRANT_ORIGINS[playerId];
  const coinPositions = HOME_BASE_POSITIONS[playerId];

  const zoneSize = CELL_SIZE * 6;
  const top = originRow * CELL_SIZE;
  const left = originCol * CELL_SIZE;

  const coinSize = CELL_SIZE * 0.85;

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
        <View style={[styles.coinBox, { borderColor: color }]}>
          <View style={styles.coinGrid}>
            <View style={styles.coinRow}>
              {coinPositions.slice(0, 2).map((_, index) => (
                <Coin key="1st row"
                      color={color}
                      size={coinSize}
                      isSelected={false}
                      isComputer={false}
                      disabled={true}
                />
              ))}
            </View>

            <View style={styles.coinRow}>
              {coinPositions.slice(2, 4).map((_, index) => (
                <Coin key="2nd row"
                      color={color}
                      size={coinSize}
                      isSelected={false}
                      isComputer={false}
                      disabled={true}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
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
});