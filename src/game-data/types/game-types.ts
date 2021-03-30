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
  players: IPlayersState;
  turn: Players;
}

export interface IGameStateAdaptedToPlayer {
  _id: string;
  players: IPlayersState;
  board: IBoardStateAdaptedToPlayer;
  hand: IPlayerHand;
  turn: Players;
}

export interface IBoardStateAdaptedToPlayer
  extends Record<Players, Omit<IPlayerBoard, 'hand' | 'deck'>> {}

// PLAYERS
export interface IPlayerState {
  userId: string;
  turnState: ITurnState;
  actionsMeta: IActionsState;
  first: boolean;
}

export interface IPlayersState extends Record<Players, IPlayerState> {}
export class IPlayersStateClass implements IPlayersState {
  playerBlue: IPlayerState;
  playerRed: IPlayerState;
}

export interface IActionsState {
  max: number;
  available: number;
}

export interface ITurnState {
  wave: Waves;
  state: TurnStage;
}

// export interface IBoardState {}
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
}

export class IPlayerHand {
  cards: CharacterList[];
}

export class IBoardCard {
  cardType: string;
  stats: IBoardCardStats;
  effects: IBoardCardEffect[];
}

export class IBoardCardStats {
  attack: number;
  health: number;
}

export class IBoardCardEffect {}

export class IPlayerUnit {}
