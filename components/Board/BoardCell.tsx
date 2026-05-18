import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

type CellType = "track" | "safe" | "homeStretch" | "center" | "blank";

type BoardCellProps = {
  row: number;
  col: number;
  cellType: CellType;
  color?: string;
  size: number;
};

function CenterCell({ size }: { size: number }) {
  const half = size / 2;
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          borderLeftWidth: half,
          borderRightWidth: half,
          borderBottomWidth: half,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: Colors.player.red,
        }}
      />

      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          borderLeftWidth: half,
          borderBottomWidth: half,
          borderTopWidth: half,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: Colors.player.blue,
        }}
      />

      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          borderTopWidth: half,
          borderRightWidth: half,
          borderLeftWidth: half,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: Colors.player.green,
        }}
      />

      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          borderTopWidth: half,
          borderRightWidth: half,
          borderBottomWidth: half,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderRightColor: Colors.player.yellow,
        }}
      />
    </View>
  );
}

export default function BoardCell({ cellType, color, size }: BoardCellProps) {
  const cellStyle = {
    width: size,
    height: size,
  };

  if (cellType === "blank") {
    return <View style={[cellStyle, styles.blank]} />;
  }

  if (cellType === "center") {
    return <CenterCell size={size} />;
  }

  if (cellType === "safe") {
    return (
      <View style={[cellStyle, styles.safeCell]}>
        <Text style={[styles.safeStar, { fontSize: size * 0.5 }]}>★</Text>
      </View>
    );
  }

  if (cellType === "homeStretch") {
    return (
      <View
        style={[
          cellStyle,
          styles.trackCell,
          { backgroundColor: color ?? Colors.ui.cardBg },
        ]}
      />
    );
  }

  return <View style={[cellStyle, styles.trackCell]} />;
}

const styles = StyleSheet.create({
  blank: {
    backgroundColor: "transparent",
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.4)",
  },
  safeCell: {
    backgroundColor: Colors.board.cellSafe,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  safeStar: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  trackCell: {
    backgroundColor: Colors.board.cellDefault,
    borderWidth: 0.5,
    borderColor: "rgba(,0,0,0.4)",
  },
});
