import {StyleSheet,Switch,Text,TouchableOpacity,View} from "react-native";
import {SettingConfig} from "../../constants/AdvancedSettingsConfig";

type SettingToggleRowProps={
    config:SettingConfig;
    value:boolean;
    onToggle:()=>void;
    onPressInfo:()=>void;
};

export default function SettingToggleRow({config,value,onToggle,onPressInfo}:SettingToggleRowProps){
    return(
        <TouchableOpacity
            style={styles.settingsRow}
            onPress={onPressInfo}
            activeOpacity={0.7}
        >
            <View style={styles.settingsIcon}>
                <Text style={styles.settingIconText}>{config.icon}</Text>
            </View>

            <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{config.label}</Text>
            </View>
            
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: "rgba(255,255,255,0.15)", true: "#f7c948" }}
                thumbColor={value ? "#1a0a2e" : "rgba(255,255,255,0.6)"}
            />
        </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
    settingsRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 12,
    },
    settingsIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.08)",
        alignItems: "center",
        justifyContent: "center",
    },
    settingIconText: {
        fontSize: 20,
    },
    settingText: {
        flex: 1,
        gap: 2,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#ffffff",
    },
});