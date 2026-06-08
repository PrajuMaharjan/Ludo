import {useEffect,useRef} from "react";
import {Animated,StyleSheet,Text,TouchableOpacity,View} from "react-native";

type CoinProps={
    color:string;
    size:number;
    isSelected:boolean;
    isComputer:boolean;
    onPress?:()=>void;
    disabled?:boolean;
};

function darken(hex:string):string{
    const clean=hex.replace("#","");
    const r=parseInt(clean.substring(0,2),16);
    const g=parseInt(clean.substring(2,4),16);
    const b=parseInt(clean.substring(4,6),16);
    const f=0.6;
    return `rgb(${Math.floor(r*f)},${Math.floor(g*f)},${Math.floor(b*f)})`;
}

export default function Coin({color,size,isSelected,isComputer,onPress,disabled=false}:CoinProps){

    const pulseAnim=useRef(new Animated.Value(1)).current;
    const glowAnim=useRef(new Animated.Value(0)).current;
    const pressAnim=useRef(new Animated.Value(1)).current;
    const pulseLoop=useRef<Animated.CompositeAnimation | null>(null);

// Glow fade in and out
    useEffect(()=>{
        Animated.timing(glowAnim,{
            toValue:isSelected ? 1 : 0,
            duration:200,
            useNativeDriver:false,
        }).start();
    },[isSelected,glowAnim]);

// Pulsing effect
    useEffect(()=>{
        if(isSelected){
            pulseLoop.current=Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim,{
                        toValue:1.18,
                        duration:450,
                        useNativeDriver:true
                    }),
                    Animated.timing(pulseAnim,{
                        toValue:1,
                        duration:450,
                        useNativeDriver:true
                    }),
                ])
            );
            pulseLoop.current.start();
        }else{
            pulseLoop.current?.stop();
            pulseAnim.setValue(1);
        }
        return ()=>pulseLoop.current?.stop();
    },[isSelected,pulseAnim]);

// Press feedback
    const onPressIn=()=>Animated.spring(pressAnim,{
                                                    toValue:0.88,
                                                    useNativeDriver:true,
                                                    speed:40
    }).start();

    const onPressOut=()=>Animated.spring(pressAnim,{
                                                    toValue:1,
                                                    useNativeDriver:true,
                                                    speed:20
    }).start();

// Sizes of coin and the ring around it
    const innerSize=size*0.74;
    const dotSize=size*0.26;
    const ringThickness=size*0.10;

// Glowing ring
    const glowBorderColor=glowAnim.interpolate({
        inputRange:[0,1],
        outputRange:["rgba(255,255,255,0)","#ffffff"]
    });

    return(
        // Pulse
        <Animated.View style={{
                                transform:[
                                            {scale:pulseAnim},
                                            {scale:pressAnim},
                                          ],
                            }}
        >
            <TouchableOpacity onPress={onPress}
                              onPressIn={onPressIn}
                              onPressOut={onPressOut}
                              disabled={disabled || !onPress}
                              activeOpacity={1}
            >
                <Animated.View style={[styles.outerRing,{
                                        width:size,
                                        height:size,
                                        borderRadius:size/2,
                                        borderWidth:ringThickness,
                                        borderColor:glowBorderColor
                                      }]}
                >
                    <View style={[styles.shadowLayer,{
                                    width:innerSize,
                                    height:innerSize,
                                    borderRadius:innerSize/2,
                                    backgroundColor:darken(color),
                                    top:(size-innerSize)/2+2
                                }]}
                    />

                    <View style={[styles.coinFace,{
                                    width:innerSize,
                                    height:innerSize,
                                    borderRadius:innerSize/2,
                                    backgroundColor:color,
                                    top:(size-innerSize)/2-1
                                }]}
                    >
                        <View style={[styles.highlightRing,{
                                        width:innerSize*0.8,
                                        height:innerSize*0.8,
                                        borderRadius:(innerSize*0.8)/2
                                    }]}
                        />

                        {/* Center */}
                        {isComputer ?(
                            <Text style={{fontSize:innerSize*0.42,lineHeight:innerSize}}>
                                🤖
                            </Text>
                        ) : (
                            <View style={[styles.centerDot,{
                                            width:dotSize,
                                            height:dotSize,
                                            borderRadius:dotSize/2
                                        }]}
                            />
                        )}
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles=StyleSheet.create({
    outerRing:{
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"transparent",
    },
    shadowLayer:{
        position:'absolute',
    },
    coinFace:{
        position:'absolute',
        alignItems:'center',
        justifyContent:'center',
    },
    highlightRing:{
        position:'absolute',
        borderWidth:1.5,
        borderColor:'rgba(255,255,255,0.35)',
    },
    centerDot:{
        backgroundColor:'rgba(255,255,255,0.75)',
    }
});