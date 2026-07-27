import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    BackHandler,
    ImageBackground,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import {
    AdvancedSettings,
    DEFAULT_ADVANCED_SETTINGS,
    useGame,
} from "../store/GameContext";
import {SETTINGS,SettingConfig} from "../constants/AdvancedSettingsConfig";
import BackButton from "../components/common/BackButton";
import ScreenTitle from "../components/common/ScreenTitle";
import ResetButton from "../components/common/ResetButton";
import PrimaryButton from "../components/common/PrimaryButton";
import ConfirmModal from "../components/common/ConfirmModal";
import SettingsGroup from "../components/common/SettingsGroup";
import DescriptionModal from "../components/common/DescriptionModal";
import FixPopup from "../components/common/FixPopup";

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

  const toggle = (key: keyof AdvancedSettings) => {
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
            <BackButton onPress={handleBack} />

            <ScreenTitle title="Advanced" />

            {/* Reset Button */}
            <ResetButton onPress={handleReset} />

          </View>

          {/* Rules Group : Release */}
          <SettingsGroup title="RELEASE RULES"
                         hint="Atleast one of these must be enabled"
                         configs={SETTINGS.filter((s) => ["releaseOnOne", "releaseOnSix"].includes(s.key))}
                         values={local}
                         onToggle={toggle}
                         onPressInfo={setDescConfig}
          />
              
          {/* Rules Group : Penalty */}
          <SettingsGroup title="PENALTY RULES"
                         hint="Increases the risk of playing aggressively"
                         configs={SETTINGS.filter((s) => ["furthestDiesOnNoKill", "furthestDiesOnThreeOnes"].includes(s.key),)}
                         values={local}
                         onToggle={toggle}
                         onPressInfo={setDescConfig}
          />

          {/* Rules Group : Home */}
          <SettingsGroup title="HOME RULES"
                         hint="Changes how the coins are allowed to finish"
                         configs={SETTINGS.filter((s) => ["mustKillToEnterHome"].includes(s.key),)}
                         values={local}
                         onToggle={toggle}
                         onPressInfo={setDescConfig}
          />

          {/* Rules Group : GameMode */}
          <SettingsGroup title="GAME MODE"
                         hint="Experimental - Changes core movement rules"
                         configs={SETTINGS.filter((s) => ["partialPointDistributionMode","forwardsBackwardsMode"].includes(s.key),)}
                         values={local}
                         onToggle={toggle}
                         onPressInfo={setDescConfig}
          />

          {/* Save Button */}
          <PrimaryButton label="Save Settings" onPress={handleSaveAndExit} />
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

      <ConfirmModal
        visible={unsavedVisible}
        title="Unsaved Changes"
        body="You have unsaved changes. What would you like to do?"
        buttons={[
          {label:"Exit Without Saving",style:"destructive",onPress:()=>{setUnsavedVisible(false); router.back();}},
          {label:"Save and Exist",style:"primary",onPress:handleSaveAndExit},
          {label:"Cancel",style:"cancel",onPress:()=>setUnsavedVisible(false)},
        ]}
        onDismiss={()=>setUnsavedVisible(false)}
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
});