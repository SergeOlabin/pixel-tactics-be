// general
export enum GameEvent {
  ToServer = 'GameEvent/ToServer',
  ToClient = 'GameEvent/ToClient',
}

export interface IGameEvent {
  type: GameEventTypes;
  gameId: string;
  payload: unknown;
}

// types
export enum GameEventTypes {
  DrawCard = 'drawCard',
  DrawCardsForLeader = 'drawCardsForLeader',
  Move = 'move',
  PlayCard = 'playCard',
  SelectLeader = 'selectLeader',
}

// PAYLOADS
export interface IBaseGameEventPayload {
  userId: string;
}

export interface IDrawCardPayload extends IBaseGameEventPayload {
  cardsAmount?: number;
}
