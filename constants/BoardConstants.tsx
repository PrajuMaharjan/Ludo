import {Dimensions} from "react-native";

const {width:SCREEN_WIDTH}=Dimensions.get("window");

export const BOARD_SIZE=SCREEN_WIDTH-16;
export const CELL_SIZE=BOARD_SIZE/15;