export const BOARD_SIZE = 15;
export const PIECES_PER_PLAYER = 4;
export const TOTAL_CELLS = 52;
export const HOME_STRETCH = 5;
export const DICE_MIN = 1;
export const DICE_MAX = 6;
export const ROLL_TO_EXIT = 6;

export type PlayerConfig = {
  id: number;
  color: string;
  colorName: string;
  startCell: number;
  homeEntry: number;
  safeCell: number;
};

export const PLAYER_CONFIG: PlayerConfig[] = [
  {
    id: 0,
    color: "#e63946",
    colorName: "Red",
    startCell: 0,
    homeEntry: 51,
    safeCell: 0,
  },
  {
    id: 1,
    color: "#4361ee",
    colorName: "Blue",
    startCell: 13,
    homeEntry: 12,
    safeCell: 13,
  },
  {
    id: 2,
    color: "#2dc653",
    colorName: "Green",
    startCell: 26,
    homeEntry: 25,
    safeCell: 26,
  },
  {
    id: 3,
    color: "#f7c948",
    colorName: "Yellow",
    startCell: 39,
    homeEntry: 38,
    safeCell: 39,
  },
];

export const SAFE_CELLS: number[] = [0, 8, 13, 21, 26, 34, 39, 47];

export const HOME_STRETCH_LENGTH = 5;
export const FINISHED_POSITION = 5;

export const EXTRA_TURN_ON_SIX = true;
export const EXTRA_TURN_ON_CAPTURE = true;
export const MAX_CONSECUTIVE_ONES = 3;

export type GameMode = "local" | "computer";

export const GAME_MODES: Record<GameMode, string> = {
  local: "Local Multiplayer",
  computer: "vs Computer",
};

export const CELL_POSITIONS: [number, number][] = [
  [6, 1], // 0  - Red start
  [6, 2], // 1
  [6, 3], // 2
  [6, 4], // 3
  [6, 5], // 4
  [5, 6], // 5
  [4, 6], // 6
  [3, 6], // 7
  [2, 6], // 8  - Safe (star)
  [1, 6], // 9
  [0, 6], // 10
  [0, 7], // 11
  [0, 8], // 12
  [1, 8], // 13 - Blue start
  [2, 8], // 14
  [3, 8], // 15
  [4, 8], // 16
  [5, 8], // 17
  [6, 9], // 18
  [6, 10], // 19
  [6, 11], // 20
  [6, 12], // 21 - Safe (star)
  [6, 13], // 22
  [6, 14], // 23
  [7, 14], // 24
  [8, 14], // 25
  [8, 13], // 26 - Green start
  [8, 12], // 27
  [8, 11], // 28
  [8, 10], // 29
  [8, 9], // 30
  [9, 8], // 31
  [10, 8], // 32
  [11, 8], // 33
  [12, 8], // 34 - Safe (star)
  [13, 8], // 35
  [14, 8], // 36
  [14, 7], // 37
  [14, 6], // 38
  [13, 6], // 39 - Yellow start
  [12, 6], // 40
  [11, 6], // 41
  [10, 6], // 42
  [9, 6], // 43
  [8, 5], // 44
  [8, 4], // 45
  [8, 3], // 46
  [8, 2], // 47 - Safe (star)
  [8, 1], // 48
  [8, 0], // 49
  [7, 0], // 50
  [6, 0], // 51
];

export const HOME_STRETCH_POSITIONS: Record<number, [number, number][]> = {
  0: [
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
  ],
  1: [
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
  ],
  2: [
    [7, 13],
    [7, 12],
    [7, 11],
    [7, 10],
    [7, 9],
  ],
  3: [
    [13, 7],
    [12, 7],
    [11, 7],
    [10, 7],
    [9, 7],
  ],
};

export const HOME_BASE_POSITIONS: Record<number, [number, number][]> = {
  0: [
    [1, 1],
    [1, 3],
    [3, 1],
    [3, 3],
  ],
  1: [
    [1, 11],
    [1, 13],
    [3, 11],
    [3, 13],
  ],
  2: [
    [11, 11],
    [11, 13],
    [13, 11],
    [13, 13],
  ],
  3: [
    [11, 1],
    [11, 3],
    [13, 1],
    [13, 3],
  ],
};

export const CENTER_CELL: [number, number] = [7, 7];
