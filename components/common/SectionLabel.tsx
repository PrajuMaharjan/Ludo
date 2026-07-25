import {StyleSheet,Text} from "react-native";

type SectionLabelProps={
    label:string;
};

export default function SectionLabel({label}:SectionLabelProps){
    return(
        <Text style={styles.label}>{label}</Text>
    )
}

const styles=StyleSheet.create({
    label: {
        fontSize: 11,
        fontWeight: "bold",
        color: "rgba(255,255,255,0.9)",
        letterSpacing: 3,
    },
});