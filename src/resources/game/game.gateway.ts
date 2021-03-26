import { Logger } from '@nestjs/common';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { UsersOnlineRegistry } from '../../shared/services/users-online.registry';
import {
  GameStartEventsToClient,
  IAcceptGamePayload,
  IAskAcceptPayload,
  IChallengeGamePayload,
} from '../app-gateway/types/game-start-socket-events';
import { GameStateToUserAdapterService } from './adapters/game-state-to-user.adapter';
import { PendingGamesRegistry } from './registries/pending-games.registry';
import { GameState } from './schemas/game-state.schema';
import { GameService } from './services/game.service';

export class GameInitGateway {
  @WebSocketServer() server: Socket;

  private logger: Logger = new Logger('AppChatGateway');

  constructor(
    private readonly gameService: GameService,
    private readonly usersOnlineRegistry: UsersOnlineRegistry,
    private readonly pendingGamesRegistry: PendingGamesRegistry,
    private readonly gameStateToUserAdapterService: GameStateToUserAdapterService,
  ) {}

  challengeGame(challengeGamePayload: IChallengeGamePayload) {
    this.logger.log(`Challenge Game: ${JSON.stringify(challengeGamePayload)}`);

    const gameId = uuidv4();
    const { from, to } = challengeGamePayload;

    this.pendingGamesRegistry.addItems([
      {
        id: gameId,
        playerIds: [from, to],
      },
    ]);

    this.sendAcceptRequest({
      to,
      from,
      gameId,
    });
  }

  acceptGame(acceptGamePayload: IAcceptGamePayload) {
    this.logger.log(`AcceptGame Game: ${JSON.stringify(acceptGamePayload)}`);

    const { gameId } = acceptGamePayload;
    const game = this.pendingGamesRegistry.getItem(gameId);

    if (!game) {
      throw new WsException(`Pending game not found ${gameId}`);
    }

    this.startGame(game.playerIds, game.id);
    this.pendingGamesRegistry.removeItems([gameId]);
  }

  sendAcceptRequest({
    to,
    from,
    gameId,
  }: {
    to: string;
    gameId: string;
    from: string;
  }) {
    const user = this.usersOnlineRegistry.getItem(to);

    if (!user) {
      throw new WsException(`User not found online ${to}`);
    }

    const payload: IAskAcceptPayload = {
      from,
      gameId,
    };

    this.logger.log(`sendAcceptRequest: ${JSON.stringify(payload)}`);

    this.server
      .to(user.clientId)
      .emit(GameStartEventsToClient.AskAccept, payload);
  }

  sendGameStateToPlayer(gameState: GameState, userId: string) {
    const adaptedState = this.gameStateToUserAdapterService.adapt(
      gameState,
      userId,
    );

    const clientId = this.usersOnlineRegistry.getItem(userId).clientId;

    this.server
      .to(clientId)
      .emit(GameStartEventsToClient.SendGameState, adaptedState);
  }

  private startGame(playerIds: string[], id?: string) {
    const gameState = this.gameService.startGame(playerIds, id);

    const clientIds = playerIds.map(
      (playerId) => this.usersOnlineRegistry.getItem(playerId).clientId,
    );

    this.server
      .to(clientIds[0])
      .to(clientIds[1])
      .emit(GameStartEventsToClient.StartGame);

    this.logger.log(`STARTED GAME: ${id}`);
    playerIds.forEach((playerId) =>
      this.sendGameStateToPlayer(gameState, playerId),
    );
  }
}
