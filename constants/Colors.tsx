export const PlayerColors = {
  red: "#e63946",
  blue: "#4361ee",
  green: "#2dc653",
  yellow: "#f7c948",
} as const;

export const BoardColors = {
  background: "#0d0520",
  cellDefault: "#ffffff",
  cellSafe: "#a8dadc",
  centerFill: "rgba(0,0,0,0.15)",
} as const;

export const UIColors = {
  appBg: "#1a0a2e",
  overlayDark: "rgba(10,20,60,0.60)",
  cardBg: "rgba(255,255,255,0.07)",
  cardBorder: "rgba(255,255,255,0.12)",

  textPrimary: "#ffffff",
  textMuted: "rgba(255,255,255,0.45)",
  textHint: "rgba(255,255,255,0.30)",

  gold: "#f7c948",
  goldDark: "#b06a0a",
  goldShadow: "rgba(240,150,28,0.35)",

  switchTrackOff: "rgba(255,255,255,0.15)",
  divider: "rgba(255,255,255,0.08)",

  danger: "#e63946",
  success: "#2dc653",
  info: "#4361ee",
} as const;

export const ButtonColors = {
  playButton: {
    top: "#f5c842",
    bottomColor: "#c98f10",
    shadowColor: "#996800",
  },
  settings: {
    top: "#72e86a",
    bottom: "#3aaa32",
    shadow: "#1f7a1a",
  },
} as const;

const Colors = {
  player: PlayerColors,
  board: BoardColors,
  ui: UIColors,
  button: ButtonColors,
};

export default Colors;
