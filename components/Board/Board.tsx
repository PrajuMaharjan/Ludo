import { Animated,StyleSheet, View } from "react-native";
import {useEffect,useRef, useState} from "react";
import Svg, { Polygon } from "react-native-svg";
import { BOARD_SIZE, CELL_SIZE } from "../../constants/BoardConstants";
import Colors from "../../constants/Colors";
import {
    CELL_POSITIONS,
    HOME_STRETCH_POSITIONS,
    SAFE_CELLS,
    PLAYER_CONFIG,
    CENTER_CELL,
} from "../../constants/GameConstants";
import BoardCell from "./BoardCell";
import HomeBase from "./HomeBase";
import {Coin,useGame} from "../../store/GameContext";
import CoinComponent from "../Coin/Coin";

export type CoinAnimationData={
  coin:Coin;
  path:[number,number][];
  color:string;
  isComputer:boolean;
  onComplete:()=>void;
};

type CellType =
  | "blank"
  | "track"
  | "safe"
  | "homeStretch"
  | "center"
  | "homeBase";

function getCellType(row: number, col: number): CellType {
  const inCenter = row >= 6 && row <= 8 && col >= 6 && col <= 8;
  if (inCenter) return "center";

  for (const cells of Object.values(HOME_STRETCH_POSITIONS)) {
    if (cells.some(([r, c]) => r === row && c === col)) return "homeStretch";
  }

  const inRedBase = row >= 0 && row <= 5 && col >= 0 && col <= 5;
  const inBlueBase = row >= 0 && row <= 5 && col >= 9 && col <= 14;
  const inGreenBase = row >= 9 && row <= 14 && col >= 9 && col <= 14;
  const inYellowBase = row >= 9 && row <= 14 && col >= 0 && col <= 5;
  if (inRedBase || inBlueBase || inGreenBase || inYellowBase) return "homeBase";

  const trackIndex = CELL_POSITIONS.findIndex(
    ([tr, tc]) => tr === row && tc === col,
  );
  if (trackIndex !== -1) {
    if (SAFE_CELLS.includes(trackIndex)) return "safe";
    return "track";
  }
  return "blank";
}

function getHomeStretchColor(row: number, col: number): string | null {
  for (const [playerId, cells] of Object.entries(HOME_STRETCH_POSITIONS)) {
    if (cells.some(([sr, sc]) => sr === row && sc === col)) {
      const colors = [
        Colors.player.red,
        Colors.player.blue,
        Colors.player.green,
        Colors.player.yellow,
      ];
      return colors[Number(playerId)];
    }
  }
  return null;
}

function getHomeBaseColor(row: number, col: number): string {
  if (row >= 0 && row <= 5 && col >= 0 && col <= 5) return Colors.player.red;
  if (row >= 0 && row <= 5 && col >= 9 && col <= 14) return Colors.player.blue;
  if (row >= 9 && row <= 14 && col >= 9 && col <= 14) return Colors.player.green;
  if (row >= 9 && row <= 14 && col >= 0 && col <= 5) return Colors.player.yellow;
  return Colors.ui.appBg;
}

function CoinAnimation({coin,path,color,isComputer,onComplete}:CoinAnimationData){
  const coinSize=CELL_SIZE*0.72;

  //  Index of current cell in the movement path
  const [stepIndex,setStepIndex]=useState(0);

  // Values of the current step(Reset each step)
  const posX=useRef(new Animated.Value(0)).current;
  const posY=useRef(new Animated.Value(0)).current;
  const scale=useRef(new Animated.Value(1)).current;

  // Pixel position of the current cell
  const currentCell=path[stepIndex];

  useEffect(()=>{
    if(path.length===0){
      onComplete();
      return;
    }

    if(stepIndex>=path.length){
      onComplete();
      return;
    }

    const [row,col]=path[stepIndex];

    // The position of the cell where the coin will land
    const targetX=col*CELL_SIZE+(CELL_SIZE-coinSize)/2;
    const targetY=row*CELL_SIZE+(CELL_SIZE-coinSize)/2;

    if(stepIndex===0){
      posX.setValue(targetX);
      posY.setValue(targetY);
      scale.setValue(1);

      // Delay in hopping animation for each step
      const t=setTimeout(()=>setStepIndex(1),80);
      return ()=>clearTimeout(t);
    }

    // Redo the animation for each cell
    const [prevRow,prevCol]=path[stepIndex-1];
    const fromX=prevCol*CELL_SIZE+(CELL_SIZE-coinSize)/2;
    const fromY=prevRow*CELL_SIZE+(CELL_SIZE-coinSize)/2;

    posX.setValue(fromX);
    posY.setValue(fromY);
    scale.setValue(1);

    Animated.sequence([
      Animated.parallel([
          Animated.timing(posX,{toValue:targetX,duration:50,useNativeDriver:true}),
          Animated.timing(posY,{toValue:targetY,duration:50,useNativeDriver:true}),
          Animated.timing(scale,{toValue:1.35,duration:40,useNativeDriver:true}),
        ]),
        Animated.timing(scale,{toValue:1,duration:30,useNativeDriver:true}),
        Animated.delay(20),
    ]).start(({finished})=>{
      if(finished) setStepIndex(i=>i+1)
      });
    },[coinSize,onComplete,path,posX,posY,scale,stepIndex,]);

    if(!currentCell) return null;

    return(
      <Animated.View style={{
                            position:"absolute",
                            transform:[{translateX:posX},{translateY:posY},{scale}],
                            zIndex:20,
                            width:coinSize,
                            height:coinSize,
                           }}
      >
        <CoinComponent color={color}
                       size={coinSize}
                       isSelected={false}
                       isComputer={isComputer}
                       disabled={true}
        />
      </Animated.View>
  );
}

function CenterOverlay() {
  const size = CELL_SIZE * 3;
  const top = 6 * CELL_SIZE;
  const left = 6 * CELL_SIZE;
  const half = size / 2;

  return (
    <View
      style={{ position: "absolute", top, left, width: size, height: size }}
    >
      <Svg width={size} height={size}>
        <Polygon
          points={`0,0 ${size},0 ${half},${half}`}
          fill={Colors.player.blue}
        />

        <Polygon
          points={`${size},0 ${size},${size} ${half},${half}`}
          fill={Colors.player.green}
        />

        <Polygon
          points={`0,${size} ${size},${size} ${half},${half}`}
          fill={Colors.player.yellow}
        />

        <Polygon
          points={`0,0 0,${size} ${half},${half}`}
          fill={Colors.player.red}
        />
      </Svg>
    </View>
  );
}

type BoardProps={
  currentPlayerId:number;
  movableCoins:Coin[];
  onCoinPress:(coin:Coin)=>void;
  animatingCoins:CoinAnimationData[];
};

export default function Board({currentPlayerId,movableCoins,onCoinPress,animatingCoins}:BoardProps) {

  const {gameSettings,gameState}=useGame();

  const movingCoinKeys=new Set(animatingCoins.map(ac=>`${ac.coin.playerId}-${ac.coin.id}`));
  const trackCoinsByCell:Record<string,Coin[]>={};
  const stretchCoinsByCell:Record<string,Coin[]>={};

  for (const coin of gameState.coins){
    if(coin.status==="track"){
      const key=`track-${coin.trackIndex}`;
      if(!trackCoinsByCell[key]) trackCoinsByCell[key]=[];
      trackCoinsByCell[key].push(coin);
    }else if(coin.status==="stretch"){
      const key=`stretch-${coin.playerId}-${coin.stretchIndex}`;
      if(!stretchCoinsByCell[key]) stretchCoinsByCell[key]=[];
      stretchCoinsByCell[key].push(coin);
    }
  }
  
  // How coins look when stacked
  const offsets=[
                  {x:0,y:0},
                  {x:CELL_SIZE*0.18,y:-CELL_SIZE*0.18},
                  {x:-CELL_SIZE*0.18,y:CELL_SIZE*0.18},
                  {x:CELL_SIZE*0.18,y:CELL_SIZE*0.18},
                ];

  const rows = Array.from({ length: 15 }, (_, row) =>
    Array.from({ length: 15 }, (_, col) => ({ row, col })),
  );

  return (
    <View style={styles.board}>
      {rows.map((rowCells, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {rowCells.map(({ row, col }) => {
            const cellType = getCellType(row, col);
            if (cellType === "homeBase") {
              return (
                <View
                  key={`${row}-${col}`}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: getHomeBaseColor(row, col),
                      borderWidth: 0.5,
                      borderColor: "rgba(0,0,0,0.4)",
                    },
                  ]}
                />
              );
            }
            return (
              <BoardCell key={`${row}-${col}`}
                         row={row}
                         col={col}
                         cellType={cellType}
                         color={
                                cellType === "homeStretch" ? (getHomeStretchColor(row, col) ?? Colors.ui.cardBg) : undefined
                               }
                         size={CELL_SIZE}
              />
            );
          })}
        </View>
      ))}

      <HomeBase playerId={0} color={Colors.player.red} player={gameSettings.players.find(p=>p.id===0)} isComputer={gameSettings.players.find(p=>p.id===0)?.isComputer ?? false} isActive={currentPlayerId===0} movableCoins={movableCoins} onCoinPress={onCoinPress} movingCoinKeys={movingCoinKeys} />
      <HomeBase playerId={1} color={Colors.player.blue} player={gameSettings.players.find(p=>p.id===1)} isComputer={gameSettings.players.find(p=>p.id===1)?.isComputer ?? false} isActive={currentPlayerId===1} movableCoins={movableCoins} onCoinPress={onCoinPress} movingCoinKeys={movingCoinKeys} />
      <HomeBase playerId={2} color={Colors.player.green} player={gameSettings.players.find(p=>p.id===2)} isComputer={gameSettings.players.find(p=>p.id===2)?.isComputer ?? false} isActive={currentPlayerId===2} movableCoins={movableCoins} onCoinPress={onCoinPress} movingCoinKeys={movingCoinKeys} />
      <HomeBase playerId={3} color={Colors.player.yellow} player={gameSettings.players.find(p=>p.id===3)} isComputer={gameSettings.players.find(p=>p.id===3)?.isComputer ?? false} isActive={currentPlayerId===3} movableCoins={movableCoins} onCoinPress={onCoinPress} movingCoinKeys={movingCoinKeys} />
    
      {/* Rendering coins on track */}
      {Object.entries(trackCoinsByCell).map(([key,coins])=>{
        const trackIndex=coins[0].trackIndex;
        if (trackIndex<0 || trackIndex>=CELL_POSITIONS.length) return null;
        const [row,col]=CELL_POSITIONS[trackIndex];
        const cellTop=row*CELL_SIZE;
        const cellLeft=col*CELL_SIZE;
        const coinSize=CELL_SIZE*0.72;

        return coins.map((coin,i)=>{
          if(movingCoinKeys.has(`${coin.playerId}-${coin.id}`)) return null;
          const playerColor=PLAYER_CONFIG[coin.playerId].color;
          const isMovable=movableCoins.some(m=>m.playerId===coin.playerId && m.id===coin.id);
          const offset=offsets[i] ?? {x:0,y:0};
          return(
            <View key={`track-coin-${coin.playerId}-${coin.id}`}
                  style={{
                            position:"absolute",
                            top:cellTop+(CELL_SIZE-coinSize)/2+offset.y,
                            left:cellLeft+(CELL_SIZE-coinSize)/2+offset.x,
                            zIndex:isMovable ? 10 : 5,
                        }}
            >
              <CoinComponent color={playerColor}
                             size={coinSize}
                             isSelected={isMovable}
                             isComputer={gameSettings.players.find(p=>p.id===coin.playerId)?.isComputer ?? false}
                             disabled={!isMovable}
                             onPress={isMovable ? ()=>onCoinPress(coin) : undefined}
              />
            </View>
          );
        });
      })}

      {/* Rendering coins on stretch */}
      {Object.entries(stretchCoinsByCell).map(([key,coins])=>{
        const {playerId,stretchIndex}=coins[0];
        if (stretchIndex<0 || stretchIndex >= HOME_STRETCH_POSITIONS[playerId]?.length) return null;
        const [row,col]=HOME_STRETCH_POSITIONS[playerId][stretchIndex];
        const cellTop=row*CELL_SIZE;
        const cellLeft=col*CELL_SIZE;
        const coinSize=CELL_SIZE*0.72;

        return coins.map((coin,i)=>{
          if(movingCoinKeys.has(`${coin.playerId}-${coin.id}`)) return null;
          const playerColor=PLAYER_CONFIG[coin.playerId].color;
          const isMovable=movableCoins.some(m=>m.playerId===coin.playerId && m.id===coin.id);
          const offset=offsets[i] ?? {x:0,y:0};
          return(
            <View key={`stretch-coin-${coin.playerId}-${coin.id}`}
                  style={{
                            position:"absolute",
                            top:cellTop+(CELL_SIZE-coinSize)/2+offset.y,
                            left:cellLeft+(CELL_SIZE-coinSize)/2+offset.x,
                            zIndex:isMovable ? 10 : 5,
                        }}
            >
              <CoinComponent color={playerColor}
                             size={coinSize}
                             isSelected={isMovable}
                             isComputer={gameSettings.players.find(p=>p.id===coin.playerId)?.isComputer ?? false}
                             disabled={!isMovable}
                             onPress={isMovable ? ()=>onCoinPress(coin) : undefined}
              />
            </View>
          );
        });
      })}

      {/* Rendering coins in finish zone */}
      {(()=>{
        
        const finishedCoins=gameState.coins.filter(c=>c.status==="finished");
        if(finishedCoins.length===0) return null;
        const [row,col]=CENTER_CELL;
        const cellTop=row*CELL_SIZE;
        const cellLeft=col*CELL_SIZE;
        const coinSize=CELL_SIZE*0.72;

        return finishedCoins.map((coin,i)=>{
          const playerColor=PLAYER_CONFIG[coin.playerId].color;
          const offset=offsets[i] ?? {x:0,y:0};
          return(
            <View key={`finished-coin-${coin.playerId}-${coin.id}`}
                  style={{
                            position:"absolute",
                            top:cellTop+(CELL_SIZE-coinSize)/2+offset.y,
                            left:cellLeft+(CELL_SIZE-coinSize)/2+offset.x,
                            zIndex:5,
                        }}
            >
              <CoinComponent color={playerColor}
                             size={coinSize}
                             isSelected={false}
                             isComputer={gameSettings.players.find(p=>p.id===coin.playerId)?.isComputer ?? false}
                             disabled={true}
              />
            </View>
          );
        });
      })()}

      {/* Coin animation rendering */}
      {animatingCoins.map((ac,i)=>(
        <CoinAnimation key={`anim-${ac.coin.playerId}-${ac.coin.id}-${i}`}{...ac} />
      ))}

      <CenterOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: Colors.board.background,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
});