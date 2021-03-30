import { Injectable, Logger } from '@nestjs/common';
import { WebSocketServer, WsException, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { UsersOnlineRegistry } from '../../shared/services/users-online.registry';
import { BaseGatewayAddon } from '../app-gateway/base-gateway-addon';
import {
  GameInitEventsToClient,
  IAcceptGamePayload,
  IAskAcceptPayload,
  IChallengeGamePayload,
  IDeclineGamePayload,
} from '../app-gateway/types/game-init-socket-events';
import { GameStateToUserAdapterService } from '../../shared/services/game-state-to-user-adapter/game-state-to-user-adapter.service';
import { PendingGamesRegistry } from './registries/pending-games.registry';
import { GameState } from './schemas/game-state.schema';
import { GameInitService } from './services/game-init.service';
import { GamesOnlineRegistry } from './registries/games-online.registry';

@Injectable()
export class GameInitGateway extends BaseGatewayAddon {
  private logger: Logger = new Logger('AppChatGateway');

  constructor(
    private readonly gameInitService: GameInitService,
    private readonly usersOnlineRegistry: UsersOnlineRegistry,
    private readonly pendingGamesRegistry: PendingGamesRegistry,
    private readonly gamesOnlineRegistry: GamesOnlineRegistry,
    private readonly gameStateToUserAdapterService: GameStateToUserAdapterService,
  ) {
    super();
  }

  challengeGame(payload: IChallengeGamePayload): WsResponse {
    this.logger.log(`Challenge Game: ${JSON.stringify(payload)}`);

    const gameId = uuidv4();
    const { from, to } = payload;

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

    return {
      event: GameInitEventsToClient.ChallengeGameResponse,
      data: { gameId: gameId },
    };
  }

  acceptGame(payload: IAcceptGamePayload) {
    this.logger.log(`AcceptGame Game: ${JSON.stringify(payload)}`);

    const { gameId } = payload;
    const game = this.pendingGamesRegistry.getItem(gameId);

    if (!game) {
      throw new WsException(`Pending game not found ${gameId}`);
    }

    this.startGame(game.playerIds, game.id);
    this.pendingGamesRegistry.removeItems([gameId]);
  }

  declineGame(payload: IDeclineGamePayload) {
    this.logger.log(`declineGame: ${JSON.stringify(payload)}`);

    const { gameId } = payload;
    const game = this.pendingGamesRegistry.getItem(gameId);

    if (!game) {
      throw new WsException(`Pending game not found ${gameId}`);
    }

    const clientIds = game.playerIds.map(
      (playerId) => this.usersOnlineRegistry.getItem(playerId).clientId,
    );

    this.pendingGamesRegistry.removeItems([gameId]);
    this.server
      .to(clientIds[0])
      .to(clientIds[1])
      .emit(GameInitEventsToClient.GameDeclined, {
        from: payload.from,
      });
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
      .emit(GameInitEventsToClient.AskAccept, payload);
  }

  updateStateForGame(gameId: string, gameState: GameState) {
    const game = this.gamesOnlineRegistry.getItem(gameId);
    const userIds = game.userIds;

    userIds.forEach((userId) => this.sendGameStateToPlayer(gameState, userId));
  }

  private sendGameStateToPlayer(gameState: GameState, userId: string) {
    const adaptedState = this.gameStateToUserAdapterService.adapt(
      gameState,
      userId,
    );

    const clientId = this.usersOnlineRegistry.getItem(userId).clientId;

    this.server
      .to(clientId)
      .emit(GameInitEventsToClient.SendGameState, adaptedState);
  }

  private startGame(playerIds: string[], id?: string) {
    const gameState = this.gameInitService.startGame(playerIds, id);

    const clientIds = playerIds.map(
      (playerId) => this.usersOnlineRegistry.getItem(playerId).clientId,
    );

    this.server
      .to(clientIds[0])
      .to(clientIds[1])
      .emit(GameInitEventsToClient.StartGame);

    this.logger.log(`STARTED GAME: ${id}`);
    playerIds.forEach((playerId) =>
      this.sendGameStateToPlayer(gameState, playerId),
    );
  }
}
