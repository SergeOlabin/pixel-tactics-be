export enum GameStartEventsToServer {
  ChallengeGame = 'challengeGame',
  AcceptGame = 'acceptGame',
}

export enum GameStartEventsToClient {
  AskAccept = 'askAccept',
  SendGameState = 'sendGameState',
  StartGame = 'startGame',
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
