import {Modal,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import {SettingConfig} from "../../constants/AdvancedSettingsConfig";

type DescriptionModalProps={
    visible : boolean;
    config : SettingConfig | null;
    onClose:()=>void;
};

export default function DescriptionModal({visible,config,onClose}:DescriptionModalProps){
    if (!config) return null;
    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
                <TouchableOpacity style={styles.descModalCard} onPress={()=>{}} activeOpacity={1}>
                    <TouchableOpacity style={styles.descModalClose} onPress={onClose}>
                        <Text style={styles.descModalCloseText}>X</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.descModalIconWrap}>
                        <Text style={styles.descModalIcon}>{config.icon}</Text>
                    </View>
                    <Text style={styles.modalTitle}>{config.label}</Text>
                    <Text style={styles.modalBody}>{config.description}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const styles=StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
    },
    modalCard: {
        backgroundColor: "#1a0a2e",
        borderRadius: 24,
        padding: 28,
        width: "100%",
        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.15)",
        gap: 16,
    },
    descModalIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.08)",
        alignItems: "center",
        justifyContent: "center",
    },
    descModalIcon: {
        fontSize: 24,
    },
    descModalClose: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.1)",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-end",
    },
    descModalCloseText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    descModalCard: {
        backgroundColor: "#1a0a2e",
        borderRadius: 24,
        padding: 20,
        width: "100%",
        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.08)",
        gap: 16,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
    },
    modalBody: {
        fontSize: 14,
        color: "rgba(255,255,255,0.6)",
        textAlign: "center",
        lineHeight: 20,
    },
})