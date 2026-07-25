import {Dispatch,SetStateAction} from "react";
import {StyleSheet,Text,TextInput,TouchableOpacity,View} from "react-native";
import {Player} from "../../store/GameContext";

type PlayerRowProps={
    player:Player;
    setPlayers:Dispatch<SetStateAction<Player[]>>;
};

export default function PlayerRow({player,setPlayers}:PlayerRowProps){
    
    const handleNameChange = (name: string) => {
        setPlayers((prev) => prev.map((p) => (p.id === player.id ? { ...p, name } : p)));
    };

    const handleToggleComputer = () => {
        setPlayers((prev) =>
            prev.map((p) => {
                if (p.id === player.id) {
                    const newIsComputer = !p.isComputer;
                    return {
                        ...p,
                        isComputer: newIsComputer,
                        name: newIsComputer ? `CPU ${p.id + 1}` : `Player ${p.id + 1}`,
                    };
                }
                return p;
        }));
    };

    return(
        <View style={styles.playerRow}>
        
            {/* The circle with the colors */}
            <View style={[styles.coloredCircle, { backgroundColor: player.color }]}>
                <Text style={styles.coloredCircleText}>{player.colorName[0]}</Text>
            </View>

            {/* The Names of the players */}
            <TextInput
                style={styles.nameInput}
                value={player.name}
                onChangeText={handleNameChange}
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
                onPress={handleToggleComputer}
            >
                <Text style={styles.computerBtnIcon}>🤖</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles=StyleSheet.create({
    playerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
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
});