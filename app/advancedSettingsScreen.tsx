import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    BackHandler,
    ImageBackground,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    AdvancedSettings,
    DEFAULT_ADVANCED_SETTINGS,
    useGame,
} from "../store/GameContext";

type SettingKey = keyof AdvancedSettings;

type SettingConfig = {
  key: SettingKey;
  label: string;
  description: string;
  icon: string;
};

const SETTINGS: SettingConfig[] = [
  {
    key: "releaseOnOne",
    label: "Release A Coin On 1",
    description: "A coin can leave home base when you roll a 1.",
    icon: "1️⃣",
  },
  {
    key: "releaseOnSix",
    label: "Release A Coin On 6",
    description: "A coin can leave home base when you roll a 6.",
    icon: "6️⃣",
  },
  {
    key: "furthestDiesOnNoKill",
    label: "Furthest Coin Dies on No Kill When Possible",
    description:
      "If you can kill an enemy coin but choose not to, your furthest coin us sent back home",
    icon: "💀",
  },
  {
    key: "furthestDiesOnThreeOnes",
    label: "Furthest Coin Dies On Three 1s In A Row",
    description:
      " Rolling three 1s in a row sends your furthest coin back home.",
    icon: "🎲",
  },
  {
    key: "mustKillToEnterHome",
    label: "Must Kill to Finish",
    description:
      "A coin cannot enter the home stretch unless you have captured atlease one enemy coin. If not, it loops back around",
    icon: "🏠",
  },
  {
    key: "partialPointDistributionMode",
    label: "Partial Point Distribution Mode",
    description:
      "Split your dice roll across multiple coins. e.g roll a 6 and move one coin 2 steps and another 4 steps.",
    icon: "✂️",
  },
];

function DescriptionModal({
  visible,
  config,
  onClose,
}: {
  visible: boolean;
  config: SettingConfig | null;
  onClose: () => void;
}) {
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

function SettingsRow({
  config,
  value,
  onToggle,
  onPressInfo,
}: {
  config: SettingConfig;
  value: boolean;
  onToggle: () => void;
  onPressInfo: () => void;
}) {
  return (
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

function UnsavedChangesModal({
  visible,
  onExitWithoutSaving,
  onSaveAndExit,
  onCancel,
}: {
  visible: boolean;
  onExitWithoutSaving: () => void;
  onSaveAndExit: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={onCancel} activeOpacity={1}>
        <TouchableOpacity style={styles.descModalCard} onPress={()=>{}} activeOpacity={1}>
          <Text style={styles.modalTitle}>Unsaved Changes</Text>
          <Text style={styles.modalBody}>
            You have unsaved changes. What would you like to do?
          </Text>

          <View style={styles.unsavedBtnCol}>
            <TouchableOpacity
              style={styles.unsavedBtnExit}
              onPress={onExitWithoutSaving}
            >
              <Text style={styles.unsavedBtnExitText}>Exit Without Saving</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.unsavedBtnSave}
              onPress={onSaveAndExit}
            >
              <Text style={styles.unsavedBtnSaveText}>Save and Exit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.unsavedBtnCancel}
              onPress={onCancel}
            >
              <Text style={styles.unsavedBtnCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function FixPopup({
  visible,
  onChooseOne,
  onChooseSix,
  onClose
}: {
  visible: boolean;
  onChooseOne: () => void;
  onChooseSix: () => void;
  onClose:()=>void;
}) {
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

export default function AdvancedSettingsScreen() {
  const { advancedSettings, setAdvancedSettings } = useGame();

  const [local, setLocal] = useState<AdvancedSettings>({ ...advancedSettings });
  const [popupVisible, setPopupVisible] = useState(false);
  const [descConfig, setDescConfig] = useState<SettingConfig | null>(null);
  const [unsavedVisible, setUnsavedVisible] = useState(false);

  const hasChanges = JSON.stringify(local) !== JSON.stringify(advancedSettings);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (hasChanges) {
            setUnsavedVisible(true);
            return true;
          }
          return false;
        },
      );
      return () => subscription.remove();
    }, [hasChanges]),
  );

  const toggle = (key: SettingKey) => {
    setLocal((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBack = () => {
    if (hasChanges) {
      setUnsavedVisible(true);
    } else {
      router.back();
    }
  };

  const handleSaveAndExit = () => {
    setUnsavedVisible(false);
    if (!local.releaseOnOne && !local.releaseOnSix) {
      setPopupVisible(true);
      return;
    }
    setAdvancedSettings(local);
    router.back();
  };

  const handleReset = () => {
    setLocal({ ...DEFAULT_ADVANCED_SETTINGS });
  };

  const handlePopupChoose = (key: "releaseOnOne" | "releaseOnSix") => {
    const fixed: AdvancedSettings = { ...local, [key]: true };
    setLocal(fixed);
    setAdvancedSettings(fixed);
    setPopupVisible(false);
    router.back();
  };

  return (
    <>
      <ImageBackground
        source={require("../assets/images/BackGroundImage.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>Advanced</Text>
            {/* Reset Button */}
            <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
              <Text style={styles.resetBtnText}>Reset To Default</Text>
            </TouchableOpacity>
          </View>

          {/* Rules Group : Release */}
          <View style={styles.group}>
            <Text style={styles.groupLabel}>RELEASE RULES</Text>
            <Text style={styles.groupHint}>
              Atleast one of these must be enabled
            </Text>
            <View style={styles.card}>
              {SETTINGS.filter((s) =>
                ["releaseOnOne", "releaseOnSix"].includes(s.key),
              ).map((config, index, arr) => (
                <View key={config.key}>
                  <SettingsRow
                    config={config}
                    value={local[config.key]}
                    onToggle={() => toggle(config.key)}
                    onPressInfo={() => setDescConfig(config)}
                  />
                  {index < arr.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* Rules Group : Penalty */}
          <View style={styles.group}>
            <Text style={styles.groupLabel}>PENALTY RULES</Text>
            <View style={styles.card}>
              {SETTINGS.filter((s) =>
                ["furthestDiesOnNoKill", "furthestDiesOnThreeOnes"].includes(
                  s.key,
                ),
              ).map((config, index, arr) => (
                <View key={config.key}>
                  <SettingsRow
                    config={config}
                    value={local[config.key]}
                    onToggle={() => toggle(config.key)}
                    onPressInfo={() => setDescConfig(config)}
                  />
                  {index < arr.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* Rules Group : Home */}
          <View style={styles.group}>
            <Text style={styles.groupLabel}>HOME RULES</Text>
            <View style={styles.card}>
              {SETTINGS.filter((s) => s.key === "mustKillToEnterHome").map(
                (config) => (
                  <SettingsRow
                    key={config.key}
                    config={config}
                    value={local[config.key]}
                    onToggle={() => toggle(config.key)}
                    onPressInfo={() => setDescConfig(config)}
                  />
                ),
              )}
            </View>
          </View>

          {/* Rules Group : GameMode */}
          <View style={styles.group}>
            <Text style={styles.groupLabel}>GameMode</Text>
            <View style={styles.card}>
              {SETTINGS.filter(
                (s) => s.key === "partialPointDistributionMode",
              ).map((config) => (
                <SettingsRow
                  key={config.key}
                  config={config}
                  value={local[config.key]}
                  onToggle={() => toggle(config.key)}
                  onPressInfo={() => setDescConfig(config)}
                />
              ))}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveAndExit}>
            <Text style={styles.saveBtnText}>Save Settings</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>

      {/* Popup for when both release on six and release on one are disabled */}
      <FixPopup
        visible={popupVisible}
        onChooseOne={() => handlePopupChoose("releaseOnOne")}
        onChooseSix={() => handlePopupChoose("releaseOnSix")}
        onClose={()=>setPopupVisible(false)}
      />

      <DescriptionModal
        visible={descConfig !== null}
        config={descConfig}
        onClose={() => setDescConfig(null)}
      />

      <UnsavedChangesModal
        visible={unsavedVisible}
        onExitWithoutSaving={() => {
          setUnsavedVisible(false);
          router.back();
        }}
        onSaveAndExit={handleSaveAndExit}
        onCancel={() => setUnsavedVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,20,60,0.62)",
  },
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 48,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 60,
  },
  backBtnText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  resetBtn: {
    width: 60,
    alignItems: "flex-end",
  },
  resetBtnText: {
    color: "#f7c948",
    fontSize: 14,
    fontWeight: "bold",
  },
  group: {
    gap: 8,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 3,
  },
  groupHint: {
    fontSize: 11,
    color: "#f7c948",
    fontWeight: "bold",
    opacity: 0.8,
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
  saveBtn: {
    backgroundColor: "#f7c948",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#b06a0a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    marginTop: 4,
  },
  saveBtnText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a0a2e",
    letterSpacing: 1,
  },
  descModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  unsavedBtnCol: {
    width: "100%",
    gap: 10,
    marginTop: 4,
  },
  unsavedBtnExit: {
    backgroundColor: "rgba(230,57,70,0.2)",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e63946",
    paddingVertical: 14,
    alignItems: "center",
  },
  unsavedBtnExitText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e63946",
  },
  unsavedBtnSave: {
    backgroundColor: "#f7c948",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  unsavedBtnSaveText:{
    fontSize:14,
    fontWeight:'bold',
    color:'#1a0a2e',
  },
  unsavedBtnCancel:{
    backgroundColor:'rgba(255,255,255,0.08)',
    borderRadius:14,
    borderWidth:1.5,
    borderColor:'rgba(255,255,255,0.15)',
    paddingVertical:14,
    alignItems:'center',
  },
  unsavedBtnCancelText:{
    fontSize:14,
    fontWeight:'bold',
    color:'#ffffff'
  }
});
