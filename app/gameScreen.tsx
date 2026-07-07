import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
    BackHandler,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Board from "../components/Board/Board";
import Dice from "../components/Dice/Dice";
import Colors from "../constants/Colors";
import { Coin, useGame } from "../store/GameContext";
import { getMovableCoins } from "../utils/getMovableCoins";
import { moveCoin } from "../utils/moveCoin";

function ExitConfirmModal({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Quit Game?</Text>
          <Text style={styles.modalBody}>
            Your current game will be terminated.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalBtnCancel} onPress={onCancel}>
              <Text style={styles.modalBtnCancelText}>Keep playing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalBtnConfirm}
              onPress={onConfirm}
            >
              <Text style={styles.modalBtnConfirmText}>Quit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function GameScreen() {
  const { gameSettings, gameState, setGameState, advancedSettings } = useGame();

  const { currentPlayerId, phase } = gameState;

  const [confirmExit, setConfirmExit] = useState(false);
  const [lastRoll, setLastRoll] = useState(0);
  const [movableCoins, setMovableCoins] = useState<Coin[]>([]);

  const currentPlayer = gameSettings.players.find(
    (p) => p.id === currentPlayerId,
  );
  const isComputerTurn = currentPlayer?.isComputer ?? false;

  useFocusEffect(
    useCallback(() => {
      const backPress = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          setConfirmExit(true);
          return true;
        },
      );
      return () => backPress.remove();
    }, []),
  );

  const advanceTurn = () => {
    setMovableCoins([]);

    setGameState((prev) => {
      const ids = gameSettings.players.map((p) => p.id);
      const idx = ids.indexOf(prev.currentPlayerId);
      const nextId = ids[(idx + 1) % ids.length];
      return { ...prev, currentPlayerId: nextId, phase: "rolling" };
    });
  };

  const handleRoll = (result: number) => {
    setLastRoll(result);

    setGameState((prev)=>{

      const movable = getMovableCoins(result, prev, advancedSettings);

      if (movable.length === 0) {
        if(result===1 || result===6){
        // Extra turn roll one or six
        return {...prev,phase:"rolling"};
      }
      const ids = gameSettings.players.map((p) => p.id);
      const idx = ids.indexOf(prev.currentPlayerId);
      const nextId = ids[(idx + 1) % ids.length];
      return{...prev,currentPlayerId:nextId,phase:"rolling"};
    }
      if (movable.length === 1) {
        // Automatically move if only one movable coin
        const{updatedCoins,extraTurn}=moveCoin(movable[0],result,prev);
        if(extraTurn){
          return{...prev,coins:updatedCoins,phase:"rolling"};
        }
        const ids = gameSettings.players.map((p) => p.id);
        const idx = ids.indexOf(prev.currentPlayerId);
        const nextId = ids[(idx + 1) % ids.length];
        return{...prev,coins:updatedCoins,currentPlayerId:nextId,phase:"rolling"};
      }

        setMovableCoins(movable);
        return{ ...prev, phase: "moving" };
    });
  };

  // Move logic
  const handleCoinMove = (coin: Coin, roll: number) => {
    setMovableCoins([]);

    setGameState((prev) => {
      const { updatedCoins, extraTurn } = moveCoin(coin, roll, prev);
      if (extraTurn) {
        return { ...prev, coins: updatedCoins, phase: "rolling" };
      }

      const ids = gameSettings.players.map((p) => p.id);
      const idx = ids.indexOf(prev.currentPlayerId);
      const nextId = ids[(idx + 1) % ids.length];
      return {
        ...prev,
        coins: updatedCoins,
        currentPlayerId: nextId,
        phase: "rolling",
      };
    });
  };

  // Coin press logic
  const handleCoinPress = (coin: Coin) => {
    if (phase !== "moving") return;
    handleCoinMove(coin, lastRoll);
  };

  return (
    <View style={styles.screen}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => setConfirmExit(true)}
      >
        <Text style={styles.backBtnText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.boardArea}>
        <Board
          currentPlayerId={currentPlayerId}
          movableCoins={movableCoins}
          onCoinPress={handleCoinPress}
        />
      </View>

      <Dice
        onRoll={handleRoll}
        isComputerTurn={isComputerTurn}
        disabled={isComputerTurn || phase === "moving"}
        currentPlayerId={currentPlayerId}
      />

      <ExitConfirmModal
        visible={confirmExit}
        onCancel={() => setConfirmExit(false)}
        onConfirm={() => {
          setConfirmExit(false);
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.ui.appBg,
  },
  boardArea: {
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  modalCard: {
    backgroundColor: Colors.ui.appBg,
    borderRadius: 24,
    padding: 28,
    width: "100%",
    borderWidth: 1.5,
    borderColor: Colors.ui.cardBorder,
    gap: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.ui.textPrimary,
    textAlign: "center",
  },
  modalBody: {
    fontSize: 14,
    color: Colors.ui.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  modalBtnCancel: {
    flex: 1,
    backgroundColor: Colors.ui.cardBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.ui.cardBorder,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalBtnCancelText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.ui.textPrimary,
  },
  modalBtnConfirm: {
    flex: 1,
    backgroundColor: Colors.ui.danger,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalBtnConfirmText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  backBtn: {
    position: "absolute",
    top: 48,
    left: 8,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    color: Colors.ui.textMuted,
    fontSize: 14,
    fontWeight: "bold",
  },
});
