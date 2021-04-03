import { CharacterList } from './character-list';

export enum Players {
  Blue = 'playerBlue',
  Red = 'playerRed',
}

export enum Waves {
  Vanguard = 'vanguard',
  Flank = 'flank',
  Rear = 'rear',
}

export enum Positions {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export enum TurnStage {
  InProgress = 'InProgress',
  // Finished = 'Finished',
  Waiting = 'Waiting',
}

export interface IGameState {
  _id: string;
  // meta: IGameMeta;
  board: IBoardStateClass;
  players: IPlayersStateClass;
  turn: ITurnState;
}

export interface IGameStateAdaptedToPlayer {
  _id: string;
  players: IPlayersStateClass;
  board: IBoardStateAdaptedToPlayer;
  hand: IPlayerHand;
  turn: ITurnState;
  playerColor: Players;
}

export interface IBoardStateAdaptedToPlayer
  extends Record<Players, Omit<IPlayerBoard, 'hand' | 'deck'>> {}

// TURN
export class ITurnState {
  firstPlayer: Players;
  currentPlayer: Players;
  wave: Waves;
}

// PLAYERS
export class IPlayerState {
  userId: string;
  actionsMeta: IActionsState;
}

export class IPlayersStateClass {
  playerBlue: IPlayerState;
  playerRed: IPlayerState;
}

export interface IActionsState {
  max: number;
  available: number;
}

// export interface ITurnState {
//   wave: Waves;
//   state: TurnStage;
// }

// BOARD
export class IBoardStateClass {
  playerBlue: IPlayerBoard;
  playerRed: IPlayerBoard;
}

export class IPlayerBoard {
  hand: IPlayerHand;
  unit: IPlayerUnit;
  deck: {
    cards: CharacterList[];
    cardsLeft: number;
  };
  leader?: IPlayerLeader;
}

export class IPlayerHand {
  cards: CharacterList[];
}

export class IPlayerLeader {
  type: CharacterList;
}

export class IBoardCard {
  cardType: CharacterList;
  stats: IBoardCardStats;
  effects: IBoardCardEffect[];
}

export class IBoardCardStats {
  attack: number;
  health: number;
}

export class IBoardCardEffect {}

export class IPlayerUnit {
  [Waves.Vanguard]: {
    [Positions.Left]: IBoardCard | null;
    [Positions.Center]: IBoardCard | null;
    [Positions.Right]: IBoardCard | null;
  };
  [Waves.Flank]: {
    [Positions.Left]: IBoardCard | null;
    [Positions.Right]: IBoardCard | null;
  };
  [Waves.Rear]: {
    [Positions.Left]: IBoardCard | null;
    [Positions.Center]: IBoardCard | null;
    [Positions.Right]: IBoardCard | null;
  };
}
