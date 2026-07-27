import {StyleSheet,Text} from "react-native";

type GroupHintProps={
    hint:string;
};

export default function GroupHint({hint}:GroupHintProps){
    return <Text style={styles.groupHint}>
        {hint}
    </Text>
}

const styles=StyleSheet.create({
    groupHint: {
        fontSize: 11,
        color: "#f7c948",
        fontWeight: "bold",
        opacity: 0.8,
    },
})