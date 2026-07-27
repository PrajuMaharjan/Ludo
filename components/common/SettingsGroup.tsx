import {StyleSheet,View} from "react-native";
import {SettingConfig,SettingKey} from "../../constants/AdvancedSettingsConfig";
import {AdvancedSettings} from "../../store/GameContext";
import SectionLabel from "../common/SectionLabel";
import GroupHint from "./GroupHint";
import SettingToggleRow from "./SettingToggleRow";

type SettingsGroupProps={
    title:string;
    hint?:string;
    configs:SettingConfig[];
    values:AdvancedSettings;
    onToggle:(key:SettingKey)=>void;
    onPressInfo:(config:SettingConfig)=>void;
};

export default function SettingsGroup({title,hint,configs,values,onToggle,onPressInfo}:SettingsGroupProps){
    return(
        <View style={styles.group}>
            <SectionLabel label={title} />
            {hint && <GroupHint hint={hint} />}
            <View style={styles.card}>
                {configs.map((config, index) => (
                    <View key={config.key}>
                    <SettingToggleRow
                        config={config}
                        value={values[config.key]}
                        onToggle={() => onToggle(config.key)}
                        onPressInfo={() => onPressInfo(config)}
                    />
                    {index < configs.length - 1 && <View style={styles.divider} />}
                </View>
                ))}
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    group: {
        gap: 8,
    },
    card: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.08)",
        marginHorizontal: 16,
    },
});