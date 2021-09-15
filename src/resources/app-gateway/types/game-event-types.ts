import { CharacterList } from '../../../game-data/types/character-list';
import { IPlace } from '../../../game-data/types/game-types';

// types
export enum GameEventTypes {
  DrawCard = 'drawCard',
  DrawCardsForLeader = 'drawCardsForLeader',
  NextTurn = 'nextTurn',
  Move = 'move',
  PlayCard = 'playCard',
  SelectLeader = 'selectLeader',
  Attack = 'attack',
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

export interface IPlayCardPayload extends IBaseGameEventPayload {
  // from hand always
  toPlace: IPlace;
  cardType: CharacterList;
}

export interface IMoveCardPayload extends IBaseGameEventPayload {
  fromPlace: IPlace;
  toPlace: IPlace;
}

export interface IAttackPayload extends IBaseGameEventPayload {
  fromPlace: IPlace;
  toPlace: IPlace;
}

export enum GameEventTypesToClient {
  SelectLeaderReq = 'ToClient/selectLeaderReq',
}
