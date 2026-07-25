import {router} from "expo-router";
import {StyleSheet,Text,TouchableOpacity} from "react-native";
import {Player,useGame} from "../../store/GameContext"

type StartGameButtonProps={
    playerCount:number;
    players:Player[];
};

export default function StartGameButton({playerCount,players}:StartGameButtonProps){

    const {setGameSettings}=useGame();

    const handleStartGame = () => {
        setGameSettings({
            playerCount,
            players: players.slice(0, playerCount),
        });
        router.push("/gameScreen");
    };

    return(
        <TouchableOpacity style={styles.btn} onPress={handleStartGame}>
            <Text style={styles.btnText}>Start Game</Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    btn: {
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
    btnText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1a0a2e",
        letterSpacing: 1,
    },
});