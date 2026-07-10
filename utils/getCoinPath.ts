import {Coin} from "../store/GameContext";
import {CELL_POSITIONS,HOME_BASE_POSITIONS,HOME_STRETCH_POSITIONS,PLAYER_CONFIG,TOTAL_CELLS,HOME_STRETCH_LENGTH} from "../constants/GameConstants";

// Function to return the path(row,col) f the coin's path. Used for the movement animation
export function getCoinPath(coin:Coin,roll:number):[number,number][]{
    const path:[number,number][]=[];
    const config=PLAYER_CONFIG[coin.playerId];

    if(coin.status==="home"){
        path.push(CELL_POSITIONS[config.startCell]);
        return path;
    }

    if(coin.status==="track"){
        const homeEntry=config.homeEntry;

        const stepsToEntry=coin.trackIndex<=homeEntry ? homeEntry-coin.trackIndex : TOTAL_CELLS-coin.trackIndex+homeEntry;

        if(roll<=stepsToEntry){
            for(let s=1;s<=roll;s++){
                const idx=(coin.trackIndex+s)%TOTAL_CELLS;
                path.push(CELL_POSITIONS[idx]);
            }
        }else{
            for(let s=1;s<=stepsToEntry;s++){
                const idx=(coin.trackIndex+s)%TOTAL_CELLS;
                path.push(CELL_POSITIONS[idx]);
            }
            const stretchSteps=roll-stepsToEntry;
            for(let s=0;s<stretchSteps;s++){
                path.push(HOME_STRETCH_POSITIONS[coin.playerId][s]);
            }
        }
        return path;
    }
    if(coin.status==="stretch"){
        const newStretchIndex=coin.stretchIndex+roll;
        const limit=Math.min(newStretchIndex,HOME_STRETCH_LENGTH-1);
        for(let s=coin.stretchIndex+1;s<=limit;s++){
            path.push(HOME_STRETCH_POSITIONS[coin.playerId][s]);
        }
        return path;
    }
    return path;
}

// Function to return the backwards path of a captured coin
export function getCapturedCoinPath(coin:Coin):[number,number][]{
    if(coin.status !== "track") return [];

    const path:[number,number][]=[];
    const config=PLAYER_CONFIG[coin.playerId];

    let idx=coin.trackIndex;
    while(idx !== config.startCell){
        idx=(idx-1+TOTAL_CELLS)%TOTAL_CELLS;
        path.push(CELL_POSITIONS[idx]);
    }
    path.push(HOME_BASE_POSITIONS[coin.playerId][0]);

    return path;
}