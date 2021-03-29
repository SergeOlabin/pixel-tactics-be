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

export interface IPlayerState {
  userId: string;
  turnState: ITurnState;
  actions: IActionsState;
  first: boolean;
}

export interface IPlayersState extends Record<Players, IPlayerState> {}
export class IPlayersStateClass implements IPlayersState {
  playerBlue: IPlayerState;
  playerRed: IPlayerState;
}

export interface IGameState {
  _id: string;
  // meta: IGameMeta;
  board: IBoardState;
  players: IPlayersState;
}

export interface IBoardState {}
export class IBoardStateClass {}

export interface IActionsState {
  max: number;
  available: number;
}

export interface ITurnState {
  wave: Waves;
  state: TurnStage;
}
