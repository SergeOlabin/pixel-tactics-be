import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameStateToUserAdapterService } from '../../shared/services/game-state-to-user-adapter/game-state-to-user-adapter.service';
import { UsersOnlineRegistry } from '../../shared/services/users-online.registry';
import { GamesOnlineRegistry } from '../game/registries/games-online.registry';
import { GameState } from '../game/schemas/game-state.schema';
import { AppGatewayAddonsService } from './app-gateway-addons';
import {
  ChatEventsToServer,
  IMessagePayload,
  IOpenChatPayload,
} from './types/chat-socket-events';
import {
  GameInitEventsToClient,
  GameInitEventsToServer,
  IAcceptGamePayload,
  IChallengeGamePayload,
  IDeclineGamePayload,
} from './types/game-init-socket-events';
import {
  DrawCardEvent,
  IBaseGameEventPayload,
  IDrawCardPayload,
  PlayCardEvent,
  SelectLeaderEvent,
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
    return this.addons.gameInit.challengeGame(challengeGamePayload);
  }

  @SubscribeMessage(GameInitEventsToServer.AcceptGame)
  acceptGame(@MessageBody() acceptGamePayload: IAcceptGamePayload) {
    this.addons.gameInit.acceptGame(acceptGamePayload);
  }

  @SubscribeMessage(GameInitEventsToServer.DeclineGame)
  declineGame(@MessageBody() declineGamePayload: IDeclineGamePayload) {
    this.addons.gameInit.declineGame(declineGamePayload);
  }

  // @SubscribeMessage(PlayCardEvent.ToServer)
  @SubscribeMessage(DrawCardEvent.ToServer)
  async drawCardEvent(@MessageBody() payload: IDrawCardPayload) {
    const controller = this.gamesOnlineRegistry.getItem(payload.gameId)
      .controller;
    const updatedState = await controller.drawCard(payload);
    this.addons.gameInit.sendUpdatedGameState(payload.gameId, updatedState);
  }

  @SubscribeMessage(SelectLeaderEvent.ToSever)
  async selectLeaderFromClient(
    @MessageBody() payload: IBaseGameEventPayload,
    @ConnectedSocket() client: Socket,
  ) {
    // await this.drawCardEvent({
    //   ...payload,
    //   cardsAmount: 4,
    // });
    // const { id } = client.handshake.auth;
    // this.server.to(id).emit(SelectLeaderEvent.ToClient);
  }
}
