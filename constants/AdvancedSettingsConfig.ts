import {AdvancedSettings} from "../store/GameContext";

export type SettingKey = keyof AdvancedSettings;

export type SettingConfig = {
    key: SettingKey;
    label: string;
    description: string;
    icon: string;
};

export const SETTINGS: SettingConfig[] = [
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
    {
        key: "forwardsBackwardsMode",
        label: "Forwards / Backwards Mode",
        description:
        "Choose to move your coin forwards or backwards by the rolled amount. Useful for strategic repositioning.",
        icon: "↔️",
    },
];