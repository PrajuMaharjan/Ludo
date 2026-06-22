import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

const STORAGE_KEY = "ludo_advanced_settings";

export type Player = {
  id: number;
  name: string;
  color: string;
  colorName: string;
  isComputer: boolean;
};

export type GameSettings = {
  playerCount: number;
  players: Player[];
};

export type AdvancedSettings = {
  releaseOnOne: boolean;
  releaseOnSix: boolean;
  furthestDiesOnNoKill: boolean;
  furthestDiesOnThreeOnes: boolean;
  mustKillToEnterHome: boolean;
  partialPointDistributionMode:boolean;
};

type GameContextType = {
  gameSettings: GameSettings;
  setGameSettings: (settings: GameSettings) => void;
  advancedSettings: AdvancedSettings;
  setAdvancedSettings: (settings: AdvancedSettings) => void;
};

export const DEFAULT_PLAYERS: Player[] = [
  {
    id: 0,
    name: "Player 1",
    color: "#e63946",
    colorName: "Red",
    isComputer: false,
  },
  {
    id: 1,
    name: "Player 2",
    color: "#4361ee",
    colorName: "Blue",
    isComputer: false,
  },
  {
    id: 2,
    name: "Player 3",
    color: "#2dc653",
    colorName: "Green",
    isComputer: false,
  },
  {
    id: 3,
    name: "Player 4",
    color: "#f7c948",
    colorName: "Yellow",
    isComputer: false,
  },
];

const DEFAULT_GAME_SETTINGS: GameSettings = {
  playerCount: 2,
  players: DEFAULT_PLAYERS.slice(0, 2),
};

export const DEFAULT_ADVANCED_SETTINGS: AdvancedSettings = {
  releaseOnOne: true,
  releaseOnSix: true,
  furthestDiesOnNoKill: true,
  furthestDiesOnThreeOnes: true,
  mustKillToEnterHome: false,
  partialPointDistributionMode:false,
};

const GameContext = createContext<GameContextType>({
  gameSettings: DEFAULT_GAME_SETTINGS,
  setGameSettings: () => {},
  advancedSettings: DEFAULT_ADVANCED_SETTINGS,
  setAdvancedSettings: () => {},
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameSettings, setGameSettings] = useState<GameSettings>(
    DEFAULT_GAME_SETTINGS,
  );
  const [advancedSettings, setAdvancedSettingsState] =
    useState<AdvancedSettings>(DEFAULT_ADVANCED_SETTINGS);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setAdvancedSettingsState(JSON.parse(stored));
        }
      } catch (e) {
        console.warn("Failed to load advanced settings : ", e);
      }
    };
    load();
  }, []);

  const setAdvancedSettings = async (settings: AdvancedSettings) => {
    setAdvancedSettingsState(settings);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to save advanced settings : ", e);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameSettings,
        setGameSettings,
        advancedSettings,
        setAdvancedSettings,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
