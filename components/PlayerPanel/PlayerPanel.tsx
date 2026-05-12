import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { Player } from "../../store/GameContext";

type PlayerPanelProps = {
  players: Player[];
  currentPlayerId: number;
};

function PlayerCard({
  player,
  isActive,
  position,
}: {
  player: Player;
  isActive: boolean;
  position: number;
}) {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.92)).current;
  const glowAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 0.92,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isActive, scaleAnim, glowAnim]);

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.1)", player.color],
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ scale: scaleAnim }],
          borderColor,
        },
      ]}
    >
      <View style={[styles.colorStrip, { backgroundColor: player.color }]} />

      <View style={styles.cardBody}>
        <View style={[styles.avatar, { backgroundColor: player.color }]}>
          {position > 0 ? (
            <Text style={styles.avatarText}>
              {position === 1
                ? "🥇"
                : position === 2
                  ? "🥈"
                  : position === 3
                    ? "🥉"
                    : "🏁"}
            </Text>
          ) : (
            <Text style={styles.avatarText}>
              {player.isComputer ? "🤖" : player.name[0].toUpperCase()}
            </Text>
          )}
        </View>

        <Text style={styles.playerName} numberOfLines={1}>
          {player.name}
        </Text>

        {isActive && (
          <View style={[styles.activeDot, { backgroundColor: player.color }]} />
        )}
      </View>
    </Animated.View>
  );
}

export default function PlayerPanel({
  players,
  currentPlayerId,
}: PlayerPanelProps) {
  const finishPositions: Record<number, number> = players.reduce(
    (acc, p) => ({ ...acc, [p.id]: 0 }),
    {},
  );

  return (
    <View style={styles.panel}>
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          isActive={player.id === currentPlayerId}
          position={finishPositions[player.id]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  card: {
    flex: 1,
    height: "100%",
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: Colors.ui.cardBg,
    overflow: "hidden",
  },
  colorStrip: {
    height: 4,
    width: "100%",
  },
  cardBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
  },
  playerName: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.ui.textPrimary,
    textAlign: "center",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
