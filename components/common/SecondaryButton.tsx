import {StyleSheet,Text,TouchableOpacity} from "react-native";

type SecondaryButtonProps={
    label:string;
    onPress:()=>void;
};

export default function SecondaryButton({label,onPress}:SecondaryButtonProps){
    return(
        <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.btnText}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    btn: {
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
    btnText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
});