export enum GameInitEventsToServer {
  ChallengeGame = 'challengeGame',
  AcceptGame = 'acceptGame',
  DeclineGame = 'declineGame',
}

export enum GameInitEventsToClient {
  AskAccept = 'askAccept',
  SendGameState = 'sendGameState',
  StartGame = 'startGame',
  GameDeclined = 'gameDeclined',
  ChallengeGameResponse = 'challengeGameResponse',
}

export interface IEvent<T = Record<string, any>> {
  name: string;
  payload: T;
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

export interface IDeclineGamePayload {
  gameId: string;
  from: string;
}

export interface IUpdateGameStatePayload {}

export interface IDeclineGamePayload {
  gameId: string;
  from: string;
}
