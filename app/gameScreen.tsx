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
import Board,{CoinAnimationData} from "../components/Board/Board";
import Dice from "../components/Dice/Dice";
import Colors from "../constants/Colors";
import {PLAYER_CONFIG} from "../constants/GameConstants";
import { Coin, useGame } from "../store/GameContext";
import {getCoinPath,getCapturedCoinPath} from "../utils/getCoinPath";
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

  const [movingCoins,setMovingCoins]=useState<CoinAnimationData[]>([]);

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

  const moveCoinResult=(coin:Coin,roll:number,capturedCoin:Coin | null)=>{
    if(capturedCoin){
      const capturePath=getCapturedCoinPath(capturedCoin);
      const captureColor=PLAYER_CONFIG[capturedCoin.playerId].color;
      const captureIsComputer=gameSettings.players.find(p=>p.id===capturedCoin.playerId)?.isComputer ?? false;

      setMovingCoins(prev=>[...prev,{
        coin:capturedCoin,
        path:capturePath,
        color:captureColor,
        isComputer:captureIsComputer,
        onComplete:()=>{
          setMovingCoins([]);
          commitMove(coin,roll);
        },
      }]);
    }else{
      setMovingCoins([]);
      commitMove(coin,roll);
    }
  };

  // Returns the state of the coins after movement
  const commitMove=(coin:Coin,roll:number)=>{
    setGameState((prev)=>{
      const {updatedCoins,extraTurn}=moveCoin(coin,roll,prev);
      if(extraTurn){
        return{...prev,coins:updatedCoins,phase:"rolling"};
      }
      const ids = gameSettings.players.map((p) => p.id);
      const idx = ids.indexOf(prev.currentPlayerId);
      const nextId = ids[(idx + 1) % ids.length];
      return { ...prev, coins:updatedCoins,currentPlayerId: nextId, phase: "rolling" }; 
    })
  };

  const startAnimation=(coin:Coin,roll:number)=>{
    const path=getCoinPath(coin,roll);
    const color=PLAYER_CONFIG[coin.playerId].color;
    const isComputer=gameSettings.players.find(p=>p.id===coin.playerId)?.isComputer ?? false;

    const {updatedCoins}=moveCoin(coin,roll,gameState);
    const movedCoin=updatedCoins.find(c=>c.playerId===coin.playerId && c.id===coin.id);
    let capturedCoin:Coin | null=null;

    if(movedCoin?.status==="track"){
      const enemyOnCell=gameState.coins.find(
        c=>c.playerId !== coin.playerId && c.status==="track" && c.trackIndex===movedCoin.trackIndex) ?? null; 
      capturedCoin=enemyOnCell;
    }
    setMovableCoins([]);
    setGameState(prev=>({...prev,phase:"animating"}));

    setMovingCoins([{coin,path,color,isComputer,onComplete:()=>moveCoinResult(coin,roll,capturedCoin)}]);
  };

  const handleRoll = (result: number) => {
    setLastRoll(result);

    setGameState((prev) => {
      const movable = getMovableCoins(result, prev, advancedSettings);

      if (movable.length === 0) {
        if (result === 1 || result === 6) {
          // Extra turn roll one or six
          return { ...prev, phase: "rolling" };
        }
        const ids = gameSettings.players.map((p) => p.id);
        const idx = ids.indexOf(prev.currentPlayerId);
        const nextId = ids[(idx + 1) % ids.length];
        return { ...prev, currentPlayerId: nextId, phase: "rolling" };
      }
      if (movable.length === 1) {
        // Automatically move if only one movable coin
        setTimeout(()=>startAnimation(movable[0],result),0);
        return{...prev,phase:"animating"};
      }

      setMovableCoins(movable);
      return { ...prev, phase: "moving" };
    });
  };

  // Coin press logic
  const handleCoinPress = (coin: Coin) => {
    if (phase !== "moving") return;
    startAnimation(coin, lastRoll);
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
          animatingCoins={movingCoins}
        />
      </View>

      <Dice
        onRoll={handleRoll}
        isComputerTurn={isComputerTurn}
        disabled={isComputerTurn || phase === "moving" || phase === "animating"}
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
