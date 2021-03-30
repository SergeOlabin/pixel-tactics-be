export enum DrawCardEvent {
  ToServer = 'drawCardToServer',
}

export interface IDrawCardPayload {
  gameId: string;
  userId: string;
}

export enum PlayCardEvent {
  ToServer = 'playCardToServer',
}
