import {StyleSheet,Text,TouchableOpacity,View} from "react-native";

type CounterRowProps={
    playerCount:number;
    onSelect:(count:number)=>void;
};

const COUNTS=[2,3,4];

export default function CounterRow({playerCount,onSelect}:CounterRowProps){
    return(
        <View style={styles.counterRow}>
            {COUNTS.map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.countBtn,
                  playerCount === count && styles.countBtnActive,
                ]}
                onPress={() => onSelect(count)}
               >
                
                <Text style={[
                                styles.counterBtnText,
                                playerCount === count && styles.counterBtnTextActive]}
                >
                    {count} Players
                </Text>
              </TouchableOpacity>
            ))}
          </View>
    );
}

const styles=StyleSheet.create({
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
});