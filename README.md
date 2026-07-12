# 🎲 Ludo

A feature-rich mobile Ludo game built with **React Native + Expo**, targeting Android. Supports 2–4 players with human and CPU opponents, advanced rule toggles, and smooth coin animations.

## ✨ Features

### Gameplay
- 2–4 player support (mix of human and CPU players)
- Full Ludo board — 15×15 grid with track, safe cells, home stretch, and center zone
- Hop-by-hop coin movement animation with capture animation
- Coins stack with offset when multiple land on the same cell
- Extra turn on rolling 1 or 6
- Extra turn on capturing an enemy coin
- Turn indicator — active player's HomeBase flashes white

### Advanced Rules (toggleable)
| Rule | Description |
|------|-------------|
| Release on 1 | A coin can leave home base on a roll of 1 |
| Release on 6 | A coin can leave home base on a roll of 6 |
| Furthest Dies (No Kill) | If you can capture an enemy but don't, your furthest coin is sent home |
| Furthest Dies (Three 1s) | Rolling three 1s in a row sends your furthest coin home |
| Must Kill to Finish | A coin cannot enter the home stretch unless you've captured at least one enemy |

### UI & UX
- Player names displayed inside each HomeBase zone
- CPU players auto-roll after a short delay
- Hardware back button support on game screen and settings screens
- Unsaved changes modal in Advanced Settings
- Setting description modal (tap any setting row to read its description)
- Backdrop dismiss on all modals
- Settings persisted via AsyncStorage

---

## 🗂️ Project Structure

```
Ludo/
├── app/
│   ├── _layout.tsx                  # Root layout, wraps app in GameProvider
│   ├── index.tsx                    # Home screen
│   ├── gameSettingsScreen.tsx       # Player count, names, CPU toggle
│   ├── advancedSettingsScreen.tsx   # Rule toggles + AsyncStorage persistence
│   ├── gameScreen.tsx               # Main game screen
│   ├── settingsScreen.tsx           # General settings (placeholder)
│   └── winnerScreen.tsx             # Results screen (placeholder)
│
├── components/
│   ├── Board/
│   │   ├── Board.tsx                # 15×15 grid, coin overlays, animations
│   │   ├── BoardCell.tsx            # Individual cells
│   │   └── HomeBase.tsx             # Colored corner zones with coins + name
│   ├── Coin/
│   │   └── Coin.tsx                 # Player token with glow, pulse, press feedback
│   ├── Dice/
│   │   └── Dice.tsx                 # Flick/tap physics, face cycling, sound
│   └── PlayerPanel/
│       └── PlayerPanel.tsx          # (legacy, replaced by HomeBase names)
│
├── constants/
│   ├── BoardConstants.ts            # BOARD_SIZE, CELL_SIZE
│   ├── Colors.ts                    # All app colors
│   └── GameConstants.ts             # Ludo rules, CELL_POSITIONS, HOME_STRETCH_POSITIONS, etc.
│
├── store/
│   └── GameContext.tsx              # React Context: game state, settings, coin state
│
├── utils/
│   ├── getMovableCoins.ts           # Determines which coins can legally move
│   ├── moveCoin.ts                  # Moves a coin, handles captures + extra turns
│   └── getCoinPath.ts               # Computes animation paths (forward + capture)
│
└── assets/
    ├── images/
    │   └── BackGroundImage.png
    └── sounds/
        └── dice_roll.wav
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Android device or emulator with Expo Go installed

### Installation

```bash
git clone https://github.com/PrajuMaharjan/Ludo_React_Native_Project.git
cd Ludo_React_Native_Project
npm install
```

### Running

```bash
npx expo start
```

Then scan the QR code with Expo Go on your Android device, or press `a` to open on an Android emulator.

For USB debugging with ADB reverse:

```bash
adb reverse tcp:8081 tcp:8081
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based navigation |
| `@react-native-async-storage/async-storage` | Settings persistence |
| `expo-haptics` | Haptic feedback |
| `react-native-svg` | Board center overlay |
| `expo-audio` | Dice roll sound |

---

## 🎮 Game Rules

1. Roll the dice to take your turn
2. Roll a **6** or **1** (if enabled) to release a coin from home base
3. Move coins along the track toward your home stretch
4. Land on an enemy coin to capture it and send it back to their home base
5. Get an extra turn when you roll a 1 or 6, or capture an enemy coin
6. First player to get all 4 coins to the center wins

---

## 🛣️ Roadmap

- [ ] Win detection and finish order
- [ ] Winner screen with rankings and replay
- [ ] Capture logic fully wired
- [ ] Advanced penalty rules implementation
- [ ] AI logic (Easy / Medium / Hard)
- [ ] Coin movement animation polish
- [ ] iOS support
- [ ] Partial Point Distribution Mode

---

## 🏗️ Architecture Notes

- **State management**: React Context only — no Zustand or Redux
- **Animations**: React Native `Animated` API (not Reanimated)
- **Routing**: Expo Router with file-based routing
- **Game logic**: Pure utility functions (`getMovableCoins`, `moveCoin`, `getCoinPath`) — no side effects, easy to test
- **Turn flow**: `rolling` → `moving` (if multiple options) → `animating` → back to `rolling`

---

## 📄 License

MIT