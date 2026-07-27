import {StyleSheet,Text,TouchableOpacity} from "react-native";

type ResetButtonProps={
    onPress:()=>void;
    label?:string;
};

export default function ResetButton({onPress,label="Reset To Default"}:ResetButtonProps){
    return(
        <TouchableOpacity onPress={onPress} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    resetBtn: {
        width: 60,
        alignItems: "flex-end",
    },
    resetBtnText: {
        color: "#f7c948",
        fontSize: 14,
        fontWeight: "bold",
    },
})
