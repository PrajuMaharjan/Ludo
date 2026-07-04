import {Coin,GameState} from "../store/GameContext";
import {PLAYER_CONFIG,TOTAL_CELLS,HOME_STRETCH_LENGTH,SAFE_CELLS,EXTRA_TURN_ON_SIX,EXTRA_TURN_ON_CAPTURE} from "../constants/GameConstants";

export type MoveCoinResult={
    updatedCoins:Coin[];
    captured:boolean;
    extraTurn:boolean;
    coinFinished:boolean;
};

function stepsToHomeEntry(playerId:number,trackIndex:number):number{
    const config=PLAYER_CONFIG[playerId];
    const homeEntry=config.homeEntry;

    if(trackIndex<=homeEntry){
        return homeEntry-trackIndex;
    }else{
        return TOTAL_CELLS-trackIndex+homeEntry;
    }
}

// Function to handle coin movement,capture/extra turn logic and return the updated gamestate
export function moveCoin(coin:Coin,roll:number,gameState:GameState):MoveCoinResult{
    const {coins,currentPlayerId}=gameState;
    const config=PLAYER_CONFIG[currentPlayerId];

    let updatedCoin:Coin={...coin};
    let captured=false;
    let coinFinished=false;

    switch(coin.status){
        case "home":{
            updatedCoin={
                ...coin,
                status:"track",
                trackIndex:config.startCell,
                stretchIndex:-1,
            };
            break;
        }
        case "track":{
            const remaining=stepsToHomeEntry(currentPlayerId,coin.trackIndex);

            if(roll<=remaining){
                const newTrackIndex=(coin.trackIndex+roll)%TOTAL_CELLS;
                updatedCoin={...coin,trackIndex:newTrackIndex};
            }else{
                const stretchSteps=roll-remaining;
                const newStretchIndex=stretchSteps-1;

                if (newStretchIndex>=HOME_STRETCH_LENGTH){
                    updatedCoin={
                        ...coin,
                        status:"finished",
                        trackIndex:-1,
                        stretchIndex:-1,
                    };
                    coinFinished=true;
                }else{
                    updatedCoin={
                        ...coin,
                        status:'stretch',
                        trackIndex:-1,
                        stretchIndex:newStretchIndex,
                    };
                }
            }
            break;
        }
        case "stretch":{
            const newStretchIndex=coin.stretchIndex+roll;

            if(newStretchIndex>=HOME_STRETCH_LENGTH){
                updatedCoin={
                    ...coin,
                    status:'finished',
                    trackIndex:-1,
                    stretchIndex:-1,
                };
                coinFinished=true;
            }else{
                updatedCoin={...coin,stretchIndex:newStretchIndex};
            }
            break;
        }
        case "finished":
            break;
    }

    let updatedCoins=coins.map((c)=>c.playerId===coin.playerId && c.id===coin.id ? updatedCoin : c,);

    if(updatedCoin.status==="track"){
        const landedIndex=updatedCoin.trackIndex;
        const isSafe=SAFE_CELLS.includes(landedIndex);

        if(!isSafe){
            const enemiesOnCell=updatedCoins.filter((c)=>
                                                        c.playerId!==currentPlayerId &&
                                                        c.status==="track" &&
                                                        c.trackIndex===landedIndex,                                              
            );
            if (enemiesOnCell.length>0){
                captured=true;
                updatedCoins=updatedCoins.map((c)=>{
                    const isEnemy=enemiesOnCell.some((e)=>e.playerId===c.playerId && e.id===c.id,);
                    
                    return isEnemy ? {...c,status:'home' as const,trackIndex:-1,stretchIndex:-1} : c;
                });
            }
        }
    }

    const extraTurn=(roll===6 && EXTRA_TURN_ON_SIX) || (roll===1) || (captured && EXTRA_TURN_ON_CAPTURE);

    return {updatedCoins,captured,extraTurn,coinFinished};
}