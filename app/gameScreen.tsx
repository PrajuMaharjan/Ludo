import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
    BackHandler,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import Board from "../components/Board/Board";
import Dice from "../components/Dice/Dice";
import Colors from "../constants/Colors";
import { useGame } from "../store/GameContext";

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
  const { gameSettings } = useGame();

  const [currentPlayerId, setCurrentPlayerId] = useState(
    gameSettings.players[0]?.id ?? 0,
  );

  const [confirmExit, setConfirmExit] = useState(false);
  const [diceDisabled, setDiceDisabled] = useState(false);

  const currentPlayer = gameSettings.players.find(
    (p) => p.id === currentPlayerId,
  );
  const isComputerTurn = currentPlayer?.isComputer ?? false;

  useFocusEffect(
    useCallback(()=>{
      const backPress=BackHandler.addEventListener("hardwareBackPress",()=>{
        setConfirmExit(true);
        return true;
      });
      return()=>backPress.remove();
    },[])
  );

  const handleRoll = (result: number) => {
    setDiceDisabled(true);

    setCurrentPlayerId((prev) => {
      const ids = gameSettings.players.map((p) => p.id);
      const idx = ids.indexOf(prev);
      return ids[(idx + 1) % ids.length];
    });
    setDiceDisabled(false);
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
        <Board currentPlayerId={currentPlayerId} />
      </View>

      <Dice
        onRoll={handleRoll}
        isComputerTurn={isComputerTurn}
        disabled={diceDisabled || isComputerTurn}
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
