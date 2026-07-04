import {AdvancedSettings,Coin,GameState} from "../store/GameContext";
import {PLAYER_CONFIG,TOTAL_CELLS,HOME_STRETCH_LENGTH,ROLL_TO_EXIT} from "../constants/GameConstants";

// Function to check distance of coin from the last cell before the home stretch
function stepsToHomeEntry(playerId:number,trackIndex:number):number{
    const config=PLAYER_CONFIG[playerId];
    const homeEntry=config.homeEntry;

    if(trackIndex<=homeEntry){
        return homeEntry-trackIndex;
    }else{
        return TOTAL_CELLS-trackIndex+homeEntry;
    }
}

// Returns the ids of movable coins
export function getMovableCoins(
    roll:number,
    gameState:GameState,
    advancedSettings:AdvancedSettings,
):Coin[]{
    const {coins,currentPlayerId}=gameState;

    const playerCoins=coins.filter(
        (c)=>c.playerId===currentPlayerId && c.status !=="finished",
    );

    const movable:Coin[]=[];

    for (const coin of playerCoins){
        switch(coin.status){
            case "home":{
                const canRelease=(roll===ROLL_TO_EXIT && advancedSettings.releaseOnSix) || (roll===1 && advancedSettings.releaseOnOne);
                if (canRelease) movable.push(coin);
                break;
            }
            case "track":{
                const remaining=stepsToHomeEntry(currentPlayerId,coin.trackIndex);

                if(roll<remaining){
                    movable.push(coin);
                }else{
                    const stretchSteps=roll-remaining;
                    if(stretchSteps<=HOME_STRETCH_LENGTH){
                        movable.push(coin);
                    }
                }
                break;
            }
            case "stretch":{
                const newStretchIndex=coin.stretchIndex+roll;
                if(newStretchIndex<=HOME_STRETCH_LENGTH){
                    movable.push(coin);
                }
                break;
            }
            case "finished":
                break;
        }
    }
    return movable;
}