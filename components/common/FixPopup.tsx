import {Modal,StyleSheet,Text,TouchableOpacity,View} from "react-native";

type FixPopupProps={
    visible : boolean;
    onChooseOne:()=>void;
    onChooseSix:()=>void;
    onClose:()=>void;
};

export default function FixPopup({visible,onChooseOne,onChooseSix,onClose}:FixPopupProps){
    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
                <TouchableOpacity style={styles.modalCard} onPress={()=>{}} activeOpacity={1}>
                    <Text style={styles.modalTitle}>⚠️ Invalid Settings</Text>
                    <Text style={styles.modalBody}>
                        Atleast one of these rules must be enabled. Choose one :
                    </Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.modalBtn} onPress={onChooseOne}>
                            <Text style={styles.modalBtnIcon}>1️⃣</Text>
                            <Text style={styles.modalBtnText}>Release On 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalBtn]} onPress={onChooseSix}>
                            <Text style={styles.modalBtnIcon}>6️⃣</Text>
                            <Text style={[styles.modalBtnText]}>Release On 6</Text>
                        </TouchableOpacity>
                    </View>
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
    modalButtons: {
        flexDirection: "row",
        gap: 12,
        marginTop: 4,
    },
    modalBtn: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.15)",
        paddingVertical: 14,
        alignItems: "center",
        gap: 6,
    },
    modalBtnIcon: {
        fontSize: 24,
    },
    modalBtnText: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#ffffff",
    },
})