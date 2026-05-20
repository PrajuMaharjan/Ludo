import styles from "expo-router/build/modal/web/modalStyles";
import {useEffect,useRef,useState} from "react";
import {Animated,Dimensions,PanResponder,StyleSheet,View} from "react-native";

const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT}=Dimensions.get("window");

const DICE_SIZE=64;
const FRICTION=0.97;
const STOP_THRESHOLD=0.8;
const ROTATION=3;

const DOT_POSITIONS:Record<number,[number,number][]>={
    1:[[50,50]],
    2:[[25,25],[75,75]],
    3:[[25,25],[50,50],[75,75]],
    4:[[25,25],[25,75],[75,25],[75,75]],
    5:[[25,25],[25,75],[50,50],[75,25],[75,75]],
    6:[[25,25],[25,75],[50,25],[50,75],[75,25],[75,75]],
};

function DiceFace({value,size}:{value:number;size:number}){
    const dots=DOT_POSITIONS[value] ?? DOT_POSITIONS[1];
    const dotSize=size*0.16;

    return(
        <View style={[styles.face,{width:size,height:size,borderRadius:size*0.18}]}>
            {dots.map(([top,left],i)=>(
                <View key={i}
                      style={[styles.dot,{
                              width:dotSize,
                              height:dotSize,
                              borderRadius:dotSize/2,
                              top:`${top}%` as any,
                              left:`${left}%` as any,
                              marginTop:-(dotSize/2),
                              marginLeft:-(dotSize/2),
                      },]}
                />
            ))}
        </View>
    );
}

type DiceProps={
    onRoll:(result:number)=>void;
    isComputerTurn:boolean;
    disabled:boolean;
}

export default function Dice({onRoll,isComputerTurn,disabled}:DiceProps){
    
    const [face,setFace]=useState(1);
    const [isRolling,setIsRolling]=useState(false);

    const posX=useRef(SCREEN_WIDTH/2-DICE_SIZE/2);
    const posY=useRef(SCREEN_HEIGHT-DICE_SIZE-140);
    const animPos=useRef(new Animated.ValueXY({
        x:posX.current,
        y:posY.current,
    })).current;

    const rotation=useRef(new Animated.Value(0)).current;
    const rotationDeg=useRef(0);

    const velX=useRef(0);
    const velY=useRef(0);

    const animRef=useRef<number | null>(null);
    const rollingRef=useRef(false);

    const startPhysics=(vx:number,vy:number)=>{
        if(rollingRef.current) return;
        rollingRef.current=true;
        setIsRolling(true);

        velX.current=vx;
        velY.current=vy;

        const tick=()=>{
            velX.current*=FRICTION;
            velY.current*=FRICTION;

            posX.current+=velX.current;
            posY.current+=velY.current;

            // Bouncing logic
            // if(posX.current)
        }
    }
}

const styles=StyleSheet.create({
    face:{},
    dot:{},

})