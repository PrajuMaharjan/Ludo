import {StyleSheet,Text,} from "react-native";

type ScreenTitleProps={
    title:string;
};

export default function ScreenTitle({title}:ScreenTitleProps){

    return <Text style={styles.title}>{title}</Text>
}

const styles=StyleSheet.create({
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "white",
        letterSpacing: 1,
        top:10,
        textShadowColor:"rgba(0,0,0,0.5)",
        textShadowOffset:{width:0,height:2},
        textShadowRadius:6,
    },
});