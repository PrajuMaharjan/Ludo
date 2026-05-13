import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

type CellType="track" | "safe" | "homeStretch"| "center" | "blank";

type BoardCellProps={
    row:number;
    col:number;
    cellType:CellType;
    color?:string;
    size:number;
}

export default function BoardCell({cellType,color,size}:BoardCellProps){
    const cellStyle={
        width:size,
        height:size,
    };

    if(cellType==="blank"){
        return <View style={[cellStyle,styles.blank]} />;
    }

    if(cellType==="center"){
        return(
            <View style={[cellStyle,styles.center]}>
                <Text style={[styles.centerStar,{fontSize:size*0.6}]}>★</Text>
            </View>
        );
    }

    if(cellType==="safe"){
        return(
            <View style={[cellStyle,styles.safeCell]}>
                <Text style={[styles.safeStar,{fontSize:size*0.5}]}>★</Text>
            </View>
        );
    }

    if(cellType==="homeStretch"){
        return(
            <View style={[cellStyle,styles.cell,{backgroundColor:color ?? Colors.ui.cardBg}]} />
        );
    }

    return <View style={[cellStyle,styles.trackCell]} />;




}

const styles=StyleSheet.create({
    blank:{
        backgroundColor:"transparent",
    },
    center:{
        backgroundColor:Colors.board.centerFill,
        borderWidth:0.5,
        borderColor:Colors.board.gridLine,
        alignItems:"center",
        justifyContent:"center",
    },
    centerStar:{
        color:Colors.ui.gold,
    },
    safeCell:{
        backgroundColor:Colors.board.cellSafe,
        borderWidth:0.5,
        borderColor:Colors.board.gridLine,
        alignItems:'center',
        justifyContent:'center',
    },
    safeStar:{
        color:'#ffffff',
        fontWeight:'bold',
    },
    cell:{
        borderWidth:0.5,
        borderColor:Colors.board.gridLine,
    },
    trackCell:{
        backgroundColor:Colors.board.cellDefault,
        borderWidth:0.5,
        borderColor:Colors.board.gridLine,
    }
})