export enum DrawCardEvent {
  ToServer = 'drawCardToServer',
}

export interface IDrawCardPayload {
  gameId: string;
  userId: string;
  cardsAmount: number;
}

export enum PlayCardEvent {
  ToServer = 'playCardToServer',
}
