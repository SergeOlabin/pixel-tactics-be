export enum GameStartEventsToServer {
  ChallengeGame = 'challengeGame',
  AcceptGame = 'startGameAccept',
}

export enum GameStartEventsToClient {
  AskAccept = 'askAccept',
  SendGameState = 'sendGameState',
}

export interface IChallengeGamePayload {
  from: string;
  to: string;
}

export interface IAskAcceptPayload {
  from: string;
  gameId: string;
}

export interface IAcceptGamePayload {
  gameId: string;
}
