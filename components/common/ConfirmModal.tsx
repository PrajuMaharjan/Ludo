import {View,Text,TouchableOpacity,Modal,StyleSheet,ViewStyle,TextStyle} from "react-native";

type ButtonStyle="primary" | "destructive" | "cancel";

type ModalButton={
    label:string;
    onPress:()=>void;
    style?:ButtonStyle;
};

type ConfirmModalProps={
    visible:boolean;
    title:string;
    body?:string;
    buttons:ModalButton[];
    onDismiss?:()=>void;
};

export default function ConfirmModal({visible,title,body,buttons,onDismiss}:ConfirmModalProps){
    return(
        <Modal visible={visible} transparent animationType="fade">
            <TouchableOpacity style={styles.overlay}
                              activeOpacity={1}
                              onPress={onDismiss}
            >
                <TouchableOpacity style={styles.card} activeOpacity={1}>
                    <Text style={styles.title}>{title}</Text>
                    {body ? <Text style={styles.body}>{body}</Text> : null}

                    <View style={styles.buttons}>
                        {buttons.map((btn,index)=>(
                            <TouchableOpacity key={index}
                                              style={[styles.button,buttonContainerStyle(btn.style ?? "primary")]}
                                              onPress={btn.onPress}
                            >
                                <Text style={[styles.buttonText,buttonTextStyle(btn.style ?? "primary")]}>
                                    {btn.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

function buttonContainerStyle(style:ButtonStyle):ViewStyle{
    switch(style){
        case "destructive" : return{backgroundColor :"rgba(230,57,70,0.2)"};
        case "cancel" : return{backgroundColor:"rgba(255,255,255,0.08)",borderColor:"rgba(255,255,255,0.15"};
        default : return{backgroundColor:"#f7c948",borderColor:"#f7c948"};
    }
}

function buttonTextStyle(style:ButtonStyle):TextStyle{
    switch(style){
        case "destructive" : return{color:"#e63946"};
        case "cancel" : return{color:"#ffffff"};
        default : return{color:"#1a0a2e"};
    }
}

const styles=StyleSheet.create({
    overlay:{
        flex:1,
        backgroundColor:"rgba(0,0,0,0.7)",
        justifyContent:"center",
        alignItems:"center",
        padding:32,
    },
    card:{
        width:"100%",
        backgroundColor:"#1a1a2e",
        borderRadius:24,
        padding:28,
        borderWidth:1.5,
        borderColor:"rgba(255,255,255,0.15)",
        gap:16,
    },
    title:{
        fontSize:20,
        fontWeight:"bold",
        color:"white",
        textAlign:'center',
    },
    body:{
        fontSize:14,
        color:"rgba(255,255,255,0.6)",
        textAlign:"center",
        lineHeight:20,
    },
    buttons:{
        marginTop:4,
        gap:10,
    },
    button:{
        paddingVertical:14,
        borderRadius:14,
        alignItems:'center',
        borderWidth:1.5,
    },
    buttonText:{
        fontSize:14,
        fontWeight:'bold',
        letterSpacing:0.5,
    }
});