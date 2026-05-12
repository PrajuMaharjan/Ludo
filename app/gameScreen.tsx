import { useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import PlayerPanel from "../components/PlayerPanel/PlayerPanel";
import Colors from "../constants/Colors";
import { useGame } from "../store/GameContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function BoardPlaceholder() {
  return (
    <View style={styles.boardPlaceholder}>
      <Text style={styles.placeholderLabel}>BOARD</Text>
      <Text style={styles.placeholderSub}>15 x 15 grid goes here</Text>
    </View>
  );
}

function DicePlaceholder() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderLabel}>DICE</Text>
      <Text style={styles.placeholderSub}>Flick to roll</Text>
    </View>
  );
}

export default function GameScreen() {
  const { gameSettings } = useGame();

  const [currentPlayerId, setCurrentPlayerId] = useState(
    gameSettings.players[0]?.id ?? 0,
  );

  return (
    <View style={styles.screen}>
      <View style={styles.playerPanelArea}>
        <PlayerPanel
          players={gameSettings.players}
          currentPlayerId={currentPlayerId}
        />
      </View>

      <View style={styles.boardArea}>
        <BoardPlaceholder />
      </View>

      <View style={styles.actionBar}>
        <DicePlaceholder />
      </View>

      {/* The following lines are for development purposes only DELETE ONCE GAMELOGIC IS BUILT*/}
      <View style={styles.devControls}>
        <TouchableOpacity
          style={styles.devBtn}
          onPress={() =>
            setCurrentPlayerId((prev) => {
              const ids = gameSettings.players.map((p) => p.id);
              const idx = ids.indexOf(prev);
              return ids[(idx + 1) % ids.length];
            })
          }
        >
          <Text style={styles.devBtnText}>Next Turn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.ui.appBg,
  },
  playerPanelArea: {
    height: 90,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.divider,
  },
  boardArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBar: {
    height: 120,
    borderTopColor: Colors.ui.divider,
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  placeholderLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.ui.gold,
    letterSpacing: 2,
  },
  placeholderSub: {
    fontSize: 11,
    color: Colors.ui.textMuted,
  },
  boardPlaceholder: {
    width: SCREEN_WIDTH - 16,
    height: SCREEN_WIDTH - 16,
    backgroundColor: Colors.board.background,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.ui.cardBorder,
  },

  // Delete these once game logic is built
  devControls: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    pointerEvents: "box-none",
  },
  devBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  devBtnText: {
    color: Colors.ui.textMuted,
    fontSize: 12,
    fontWeight: "bold",
  },
});
