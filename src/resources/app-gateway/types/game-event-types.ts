import { CharacterList } from '../../../game-data/types/character-list';

// types
export enum GameEventTypes {
  DrawCard = 'drawCard',
  DrawCardsForLeader = 'drawCardsForLeader',
  NextTurn = 'nextTurn',
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

export interface ISelectLeaderPayload extends IBaseGameEventPayload {
  type: CharacterList;
}

export enum GameEventTypesToClient {
  SelectLeaderReq = 'ToClient/selectLeaderReq',
}
