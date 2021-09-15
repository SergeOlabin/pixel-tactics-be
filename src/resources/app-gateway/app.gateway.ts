import { Logger, SetMetadata, UsePipes, ValidationPipe } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UsersOnlineRegistry } from '../../shared/services/users-online.registry';
import { GameStateService } from '../game-state/game-state.service';
import { GamesOnlineRegistry } from '../game/registries/games-online.registry';
import { AppGatewayAddonsService } from './app-gateway-addons';
import { GameEventDto } from './dto/game-event.dto';
import {
  ChatEventsToServer,
  IMessagePayload,
  IOpenChatPayload,
} from './types/chat-socket-events';
import {
  GameEvent,
  GameInitEventsToServer,
  IAcceptGamePayload,
  IChallengeGamePayload,
  ICheckForExistingGamePayload,
  IDeclineGamePayload,
} from './types/game-socket-events';

@WebSocketGateway({ transports: ['websocket'] })
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  private logger: Logger = new Logger('AppGateway');
  @WebSocketServer()
  private server: Socket;

  constructor(
    private readonly usersOnlineRegistry: UsersOnlineRegistry,
    private readonly gamesOnlineRegistry: GamesOnlineRegistry,
    private readonly addons: AppGatewayAddonsService,
    private readonly moduleRef: ModuleRef,
  ) {}

  handleConnection(client: Socket) {
    const { id } = client.handshake.auth;
    this.logger.log(`handleConnection clientCfg ${id}`);
    this.usersOnlineRegistry.addItems([
      {
        userId: id,
        clientId: client.id,
      },
    ]);
  }

  handleDisconnect(client: Socket) {
    const { id } = client.handshake.auth;
    this.logger.log(`handleDisconnect clientCfg ${id}`);
    this.usersOnlineRegistry.removeItems([id]);
  }

  afterInit() {
    this.addons.setServerToAddons(this.server);
  }

  @SubscribeMessage(ChatEventsToServer.SendMessage)
  receiveMessage(@MessageBody() payload: IMessagePayload) {
    this.addons.chat.receiveMessage(payload);
  }

  @SubscribeMessage(ChatEventsToServer.OpenChat)
  openChat(
    @MessageBody() payload: IOpenChatPayload,
    @ConnectedSocket() client: Socket,
  ) {
    this.addons.chat.openChat(payload, client);
  }

  @SubscribeMessage(ChatEventsToServer.CloseChat)
  closeChat(
    @MessageBody() payload: IOpenChatPayload,
    @ConnectedSocket() client: Socket,
  ) {
    this.addons.chat.closeChat(payload, client);
  }

  @SubscribeMessage(GameInitEventsToServer.ChallengeGame)
  challengeGame(
    @MessageBody() challengeGamePayload: IChallengeGamePayload,
    // @ConnectedSocket() client: Socket,
  ): WsResponse {
    return this.addons.game.challengeGame(challengeGamePayload);
  }

  @SubscribeMessage(GameInitEventsToServer.AcceptGame)
  acceptGame(@MessageBody() acceptGamePayload: IAcceptGamePayload) {
    this.addons.game.acceptGame(acceptGamePayload);
  }

  @SubscribeMessage(GameInitEventsToServer.DeclineGame)
  declineGame(@MessageBody() declineGamePayload: IDeclineGamePayload) {
    this.addons.game.declineGame(declineGamePayload);
  }

  @SubscribeMessage(GameInitEventsToServer.CheckForExistingGame)
  @SetMetadata('custom-meta', 'asd')
  async checkForExistingGame(
    @MessageBody() payload: ICheckForExistingGamePayload,
  ) {
    const { userId } = payload;
    const games = this.gamesOnlineRegistry.getItems();

    const game = games.find((game) => game.userIds.includes(userId));

    if (!game) {
      this.logger.log(`NO requested game found for user ${userId}`);
      return;
    }

    const gameStateService = await this.addons.game.getGameStateService({
      contextId: game.contextId,
    });
    const gameState = await gameStateService.getState();

    this.addons.game.sendGameStateToPlayer(gameState, userId);
  }

  @SubscribeMessage(GameEvent.ToServer)
  @UsePipes(new ValidationPipe())
  async selectLeaderFromClient(
    @MessageBody() event: GameEventDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received: ${event.type}`);

    const gameStateService = await this.addons.game.getGameStateService({
      gameId: event.gameId,
    });

    let updatedState, responseEvent;
    try {
      [updatedState, responseEvent] = await gameStateService.handleEvent(event);
    } catch (error) {
      throw new WsException(error);
    }
    this.addons.game.sendUpdatedGameStateToAllPlayers(
      event.gameId,
      updatedState,
    );

    if (responseEvent) {
      client.join('temp');
      this.server.to('temp').emit(responseEvent);
      client.leave('temp');
    }
  }
}
