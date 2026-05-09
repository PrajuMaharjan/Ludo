import { router } from "expo-router";
import { useState } from "react";
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { DEFAULT_PLAYERS, Player, useGame } from "../store/GameContext";

function PlayerRow({
  player,
  onNameChange,
  onToggleComputer,
}: {
  player: Player;
  onNameChange: (id: number, name: string) => void;
  onToggleComputer: (id: number) => void;
}) {
  return (
    <View style={styles.playerRow}>
      {/* The circle with the colors */}
      <View style={[styles.coloredCircle, { backgroundColor: player.color }]}>
        <Text style={styles.coloredCircleText}>{player.colorName[0]}</Text>
      </View>

      {/* The Names of the players */}
      <TextInput
        style={styles.nameInput}
        value={player.name}
        onChangeText={(text) => onNameChange(player.id, text)}
        placeholder={`Player ${player.id + 1}`}
        placeholderTextColor="rgba(255,255,255,0.3)"
        maxLength={20}
      />
      {/* Button to toggle computer opponent */}
      <TouchableOpacity
        style={[
          styles.computerBtn,
          player.isComputer && styles.computerBtnActive,
        ]}
        onPress={() => onToggleComputer(player.id)}
      >
        <Text style={styles.computerBtnIcon}>🤖</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function GameSettingsScreen() {
  const { setGameSettings } = useGame();

  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<Player[]>(
    DEFAULT_PLAYERS.map((p) => ({ ...p })),
  );

  const handlePlayerCount = (count: number) => {
    setPlayerCount(count);
  };

  const handleNameChange = (id: number, name: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const handleToggleComputer = (id: number) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newIsComputer = !p.isComputer;
          return {
            ...p,
            isComputer: newIsComputer,
            name: newIsComputer ? `CPU ${p.id + 1}` : `Player ${p.id + 1}`,
          };
        }
        return p;
      }),
    );
  };

  const handleStartGame = () => {
    setGameSettings({
      playerCount,
      players: players.slice(0, playerCount),
    });
    router.push("/gameScreen");
  };

  const activePlayers = players.slice(0, playerCount);

  return (
    <ImageBackground
      source={require("../assets/images/BackGroundImage.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Game Setup</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NUMBER OF PLAYERS</Text>
          <View style={styles.counterRow}>
            {[2, 3, 4].map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.countBtn,
                  playerCount === count && styles.countBtnActive,
                ]}
                onPress={() => handlePlayerCount(count)}
              >
                <Text
                  style={[
                    styles.counterBtnText,
                    playerCount === count && styles.counterBtnTextActive,
                  ]}
                >
                  {count} Players
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PLAYERS</Text>
          <View style={styles.playerCard}>
            {activePlayers.map((player, index) => (
              <View key={player.id}>
                <PlayerRow
                  player={player}
                  onNameChange={handleNameChange}
                  onToggleComputer={handleToggleComputer}
                />

                {/* Divider */}
                {index < activePlayers.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Button for advanced settings */}
        <TouchableOpacity
          style={styles.advancedBtn}
          onPress={() => router.push("/advancedSettingsScreen")}
        >
          <Text style={styles.advancedBtnText}>⚙️ Advanced Settings</Text>
        </TouchableOpacity>

        {/* Start game button */}
        <TouchableOpacity style={styles.startBtn} onPress={handleStartGame}>
          <Text style={styles.startBtnText}> Start Game</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,20,60,0.60)",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    marginBottom: 8,
    justifyContent: "center",
    height: 50,
  },
  backBtn: {
    position: "absolute",
    left: 0,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
    width: 60,
  },
  backBtnText: {
    color: "rgba(255,255,255,1)",
    fontSize: 15,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    top: 10,
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    justifyContent: "center",
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 3,
  },
  counterRow: {
    flexDirection: "row",
    gap: 12,
  },
  countBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
  },
  countBtnActive: {
    backgroundColor: "#f7c948",
    borderColor: "#f7c948",
  },
  counterBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 1,
  },
  counterBtnTextActive: {
    color: "#1a0a2e",
  },
  playerCard: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 16,
  },
  coloredCircle: {
    width: 40,
    height: 40,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  coloredCircleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  computerBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
  },
  computerBtnIcon: {
    fontSize: 20,
  },
  computerBtnActive: {
    backgroundColor: "green",
    borderColor: "#6366f1",
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  advancedBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  advancedBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  startBtn: {
    backgroundColor: "#f7c948",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#b06a0a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  startBtnText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a0a2e",
    letterSpacing: 1,
  },
});
