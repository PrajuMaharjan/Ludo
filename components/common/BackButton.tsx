import {router} from "expo-router";
import {StyleSheet,Text,TouchableOpacity} from "react-native";

type BackButtonProps={
    onPress?:()=>void;
};

export default function BackButton({onPress}:BackButtonProps){
    return(
        <TouchableOpacity
            onPress={onPress ?? (() => router.back())}
            style={styles.backBtn}
        >
            <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
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
});