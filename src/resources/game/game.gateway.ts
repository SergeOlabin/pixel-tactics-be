import { Injectable, Logger } from '@nestjs/common';
import { ContextId, ContextIdFactory, ModuleRef } from '@nestjs/core';
import { WsException, WsResponse } from '@nestjs/websockets';
import { v4 as uuidv4 } from 'uuid';
import { GameStateToUserAdapterService } from '../../shared/services/game-state-to-user-adapter/game-state-to-user-adapter.service';
import { UsersOnlineRegistry } from '../../shared/services/users-online.registry';
import { BaseGatewayAddon } from '../app-gateway/base-gateway-addon';
import {
  GameInitEventsToClient,
  IAcceptGamePayload,
  IAskAcceptPayload,
  IChallengeGamePayload,
  IDeclineGamePayload,
} from '../app-gateway/types/game-socket-events';
import { GameStateService } from '../game-state/game-state.service';
import { GamesOnlineRegistry } from './registries/games-online.registry';
import { PendingGamesRegistry } from './registries/pending-games.registry';
import { GameState } from './schemas/game-state.schema';
import { GameInitService } from './services/game-init.service';

@Injectable()
export class GameGateway extends BaseGatewayAddon {
  private logger: Logger = new Logger('AppChatGateway');

  constructor(
    private readonly gameInitService: GameInitService,
    private readonly usersOnlineRegistry: UsersOnlineRegistry,
    private readonly pendingGamesRegistry: PendingGamesRegistry,
    private readonly gamesOnlineRegistry: GamesOnlineRegistry,
    private readonly gameStateToUserAdapterService: GameStateToUserAdapterService,
    private readonly moduleRef: ModuleRef,
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

  async acceptGame(payload: IAcceptGamePayload) {
    this.logger.log(`AcceptGame Game: ${JSON.stringify(payload)}`);

    const { gameId } = payload;
    const game = this.pendingGamesRegistry.getItem(gameId);

    if (!game) {
      throw new WsException(`Pending game not found ${gameId}`);
    }

    const gameIdReq = await this.startGame(game.playerIds, game.id);
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

  sendUpdatedGameStateToAllPlayers(gameId: string, gameState: GameState) {
    const game = this.gamesOnlineRegistry.getItem(gameId);
    const userIds = game.userIds;

    userIds.forEach((userId) => this.sendGameStateToPlayer(gameState, userId));
  }

  sendGameStateToPlayer(gameState: GameState, userId: string) {
    const adaptedState = this.gameStateToUserAdapterService.adapt(
      gameState,
      userId,
    );

    const clientId = this.usersOnlineRegistry.getItem(userId)?.clientId;

    if (!clientId) {
      this.logger.log(`Skipping emitting state for gameId ${gameState?._id}`);
    }

    this.logger.log(`
      EMITTING GAME STATE ${clientId}`);

    this.server
      .to(clientId)
      .emit(GameInitEventsToClient.SendGameState, adaptedState);
  }

  async getGameStateService(req: { contextId?: ContextId; gameId?: string }) {
    const { contextId, gameId } = req;

    if (!contextId && !gameId) {
      throw new WsException(
        `please provider at least one of: ['contextId' or 'gameId']`,
      );
    }

    if (contextId) {
      return await this.moduleRef.resolve(GameStateService, contextId, {
        strict: false,
      });
    }

    const gameCfg = this.gamesOnlineRegistry.getItem(gameId);

    return await this.moduleRef.resolve(GameStateService, gameCfg.contextId, {
      strict: false,
    });
  }

  private async startGame(userIds: string[], id?: string) {
    const [gameState, gameId] = await this.gameInitService.startGame(
      userIds,
      id,
    );

    const clientIds = userIds.map(
      (playerId) => this.usersOnlineRegistry.getItem(playerId).clientId,
    );

    this.server
      .to(clientIds[0])
      .to(clientIds[1])
      .emit(GameInitEventsToClient.StartGame);

    this.logger.log(`STARTED GAME: ${id}`);
    userIds.forEach((playerId) =>
      this.sendGameStateToPlayer(gameState, playerId),
    );

    return gameId;
  }
}
