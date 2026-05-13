import { Dimensions, StyleSheet, View } from "react-native";
import Colors from "../../constants/Colors";
import {
    CELL_POSITIONS,
    CENTER_CELL,
    HOME_STRETCH_POSITIONS,
    SAFE_CELLS
} from "../../constants/GameConstants";
import BoardCell from "./BoardCell";
import HomeBase from "./HomeBase";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const BOARD_SIZE = SCREEN_WIDTH - 16;
export const CELL_SIZE = BOARD_SIZE / 15;

type CellType =
  | "blank"
  | "track"
  | "safe"
  | "homeStretch"
  | "center"
  | "homeBase";

function getCellType(row: number, col: number): CellType {
  if (row === CENTER_CELL[0] && col === CENTER_CELL[1]) return "center";

  const inRedBase = row >= 1 && row <= 5 && col >= 1 && col <= 5;
  const inBlueBase = row >= 1 && row <= 5 && col >= 9 && col <= 13;
  const inGreenBase = row >= 9 && row <= 13 && col >= 9 && col <= 13;
  const inYellowBase = row >= 9 && row <= 13 && col >= 1 && col <= 5;
  if (inRedBase || inBlueBase || inGreenBase || inYellowBase) return "homeBase";

  for (const cells of Object.values(HOME_STRETCH_POSITIONS)) {
    if (cells.some(([r, c]) => r === row && c === col)) return "homeStretch";
  }

  const trackIndex = CELL_POSITIONS.findIndex(
    ([tr, tc]) => tr === row && tc === col,
  );
  if (trackIndex !== -1) {
    if (SAFE_CELLS.includes(trackIndex)) return "safe";
    return "track";
  }
  return "blank";
}

function getHomeStretchColor(row: number, col: number): string | null {
  for (const [playerId, cells] of Object.entries(HOME_STRETCH_POSITIONS)) {
    if (cells.some(([sr, sc]) => sr === row && sc === col)) {
      const colors = [
        Colors.player.red,
        Colors.player.blue,
        Colors.player.green,
        Colors.player.yellow,
      ];
      return colors[Number(playerId)];
    }
  }
  return null;
}

function getHomeBaseColor(row: number, col: number): string {
  if (row >= 1 && row <= 5 && col >= 1 && col <= 5) return Colors.player.red;
  if (row >= 1 && row <= 5 && col >= 9 && col <= 13) return Colors.player.blue;
  if (row >= 9 && row <= 13 && col >= 9 && col <= 13)
    return Colors.player.green;
  if (row >= 9 && row <= 13 && col >= 1 && col <= 5)
    return Colors.player.yellow;
  return Colors.ui.appBg;
}

export default function Board() {
  const rows = Array.from({ length: 15 }, (_, row) =>
    Array.from({ length: 15 }, (_, col) => ({ row, col })),
  );

  return (
    <View style={styles.board}>
      {rows.map((rowCells, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {rowCells.map(({ row, col }) => {
            const cellType = getCellType(row, col);
            if (cellType === "homeBase") {
              return (
                <View
                  key={`${row}-${col}`}
                  style={[
                    styles.cell,
                    { backgroundColor: getHomeBaseColor(row, col) },
                  ]}
                />
              );
            }
            return (
              <BoardCell
                key={`${row}-${col}`}
                row={row}
                col={col}
                cellType={cellType}
                color={
                  cellType === "homeStretch"
                    ? (getHomeStretchColor(row, col) ?? Colors.ui.cardBg)
                    : undefined
                }
                size={CELL_SIZE}
              />
            );
          })}
        </View>
      ))}

      <HomeBase playerId={0} color={Colors.player.red} />
      <HomeBase playerId={1} color={Colors.player.blue} />
      <HomeBase playerId={2} color={Colors.player.green} />
      <HomeBase playerId={3} color={Colors.player.yellow} />
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: Colors.board.background,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
});
