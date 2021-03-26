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
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AppGatewayAddonsService } from './app-gateway-addons';
import { UserWs } from '../../shared/decorators/user.decorator';
import { UsersOnlineRegistry } from '../../shared/services/users-online.registry';
import {
  ChatEventsToServer,
  IMessagePayload,
  IOpenChatPayload,
} from './types/chat-socket-events';
import {
  GameStartEventsToServer,
  IAcceptGamePayload,
  IChallengeGamePayload,
} from './types/game-start-socket-events';

@WebSocketGateway({ transports: ['websocket'] })
export class AppGateway {
  private logger: Logger = new Logger('AppGateway');
  @WebSocketServer()
  private server: Socket;

  constructor(
    private readonly usersOnlineRegistry: UsersOnlineRegistry,
    private addons: AppGatewayAddonsService,
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

  afterInit(server: any) {
    // throw new Error('Method not implemented.');
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

  @SubscribeMessage(GameStartEventsToServer.ChallengeGame)
  challengeGame(
    @MessageBody() challengeGamePayload: IChallengeGamePayload,
    // @ConnectedSocket() client: Socket,
  ) {
    this.addons.gameInit.challengeGame(challengeGamePayload);
  }

  @SubscribeMessage(GameStartEventsToServer.AcceptGame)
  acceptGame(@MessageBody() acceptGamePayload: IAcceptGamePayload) {
    this.addons.gameInit.acceptGame(acceptGamePayload);
  }
}
