export interface IBaseGameEventPayload {
  gameId: string;
  userId: string;
}

export enum DrawCardEvent {
  ToServer = 'drawCardToServer',
}

export interface IDrawCardPayload extends IBaseGameEventPayload {
  cardsAmount?: number;
}

export enum PlayCardEvent {
  ToServer = 'playCardToServer',
}

export enum SelectLeaderEvent {
  ToSever = 'selectLeaderEvent/ToSever',
  ToClient = 'selectLeaderEvent/ToClient',
}
