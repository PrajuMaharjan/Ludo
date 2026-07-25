import { useEffect, useRef } from "react";
import {Animated,StyleSheet,Text,} from "react-native";

type AppTitleProps={
    title:string;
};

export default function AppTitle({title}:AppTitleProps){

    const titleAnim = useRef(new Animated.Value(-60)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(titleAnim, {
                                        toValue: 0,
                                        tension: 50,
                                        friction: 7,
                                        useNativeDriver: true,
                                        }),
            Animated.timing(titleOpacity,{
                                        toValue: 1,
                                        duration: 400,
                                        useNativeDriver: true,
                                        }),
        ]).start();
    },[titleAnim, titleOpacity]);

    return (
        <Animated.View style={{
                                opacity: titleOpacity,
                                transform: [{ translateY: titleAnim }],
                                alignItems: "center",
                            }}
        >
            <Text style={styles.title}>{title}</Text>
        </Animated.View>
    );
}

const styles=StyleSheet.create({
    title: {
        fontSize: 72,
        fontWeight: "bold",
        color: "white",
        letterSpacing: 1,
    },
});