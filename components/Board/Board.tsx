import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import Colors from "../../constants/Colors";
import {
  CELL_POSITIONS,
  HOME_STRETCH_POSITIONS,
  SAFE_CELLS,
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
  const inCenter=row>=6 && row<=8 && col>=6 && col<=8;
  if(inCenter) return "center";

  for (const cells of Object.values(HOME_STRETCH_POSITIONS)) {
    if (cells.some(([r, c]) => r === row && c === col)) return "homeStretch";
  }

  const inRedBase = row >= 0 && row <= 5 && col >= 0 && col <= 5;
  const inBlueBase = row >= 0 && row <= 5 && col >= 9 && col <= 14;
  const inGreenBase = row >= 9 && row <= 14 && col >= 9 && col <= 14;
  const inYellowBase = row >= 9 && row <= 14 && col >= 0 && col <= 5;
  if (inRedBase || inBlueBase || inGreenBase || inYellowBase) return "homeBase";

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
  if (row >= 0 && row <= 5 && col >= 0 && col <= 5) return Colors.player.red;
  if (row >= 0 && row <= 5 && col >= 9 && col <= 14) return Colors.player.blue;
  if (row >= 9 && row <= 14 && col >= 9 && col <= 14) return Colors.player.green;
  if (row >= 9 && row <= 14 && col >= 0 && col <= 5) return Colors.player.yellow;
  return Colors.ui.appBg;
}

function CenterOverlay(){
  const size=CELL_SIZE*3;
  const top=6*CELL_SIZE;
  const left=6*CELL_SIZE;
  const half=size/2;
  
  return(
    <View style={{position:"absolute", top,left,width:size,height:size}}>
      <Svg width={size} height={size}>
        
        <Polygon
          points={`0,0 ${size},0 ${half},${half}`}
          fill={Colors.player.blue}
        />

        <Polygon
          points={`${size},0 ${size},${size} ${half},${half}`}
          fill={Colors.player.green}
        />

        <Polygon
          points={`0,${size} ${size},${size} ${half},${half}`}
          fill={Colors.player.yellow}
        />

        <Polygon
          points={`0,0 0,${size} ${half},${half}`}
          fill={Colors.player.red}
        />

      </Svg>
    </View>
  );
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
                    { backgroundColor: getHomeBaseColor(row, col),
                      borderWidth:0.5,
                      borderColor:"rgba(0,0,0,0.4)",
                     },
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
      <CenterOverlay />
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
