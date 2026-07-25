import { router } from "expo-router";
import { useState } from "react";
import {ImageBackground,ScrollView,StyleSheet,View} from "react-native";
import { DEFAULT_PLAYERS, Player } from "../store/GameContext";
import BackButton from "../components/common/BackButton";
import ScreenTitle from "../components/common/ScreenTitle";
import SectionLabel from "../components/common/SectionLabel";
import SecondaryButton from "../components/common/SecondaryButton";
import CounterRow from "../components/common/CounterRow";
import PlayerRow from "../components/common/PlayerRow";
import StartGameButton from "../components/common/StartGameButton";

export default function GameSettingsScreen() {

  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<Player[]>(
    DEFAULT_PLAYERS.map((p) => ({ ...p })),
  );

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
          <BackButton />
          
          <ScreenTitle title="Game Setup" />
        </View>

        <View style={styles.section}>
          <SectionLabel label="NUMBER OF PLAYERS" />
          <CounterRow playerCount={playerCount} onSelect={setPlayerCount} />
        </View>

        <View style={styles.section}>
          <SectionLabel label="PLAYERS" />
          
          <View style={styles.playerCard}>
            {activePlayers.map((player, index) => (
              <View key={player.id}>
                <PlayerRow
                  player={player}
                  setPlayers={setPlayers}
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
        <SecondaryButton label="⚙️ Advanced Settings"
          onPress={() => router.push("/advancedSettingsScreen")}
        />

        {/* Start game button */}
        <StartGameButton playerCount={playerCount} players={players} />
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
  section: {
    gap: 10,
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
});