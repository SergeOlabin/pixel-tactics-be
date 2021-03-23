import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersOnlineRegistry } from '../../shared/services/users-online.registry';
import {
  ChatEventsToClient,
  ChatEventsToServer,
  IMessagePayload,
  IOpenChatPayload,
} from './types/chat-events';
import { ChatService } from './chat.service';
import { ChatRoomsRegistry } from './registry/chat-rooms.registry';

@WebSocketGateway(3002, { namespace: 'chat', transports: ['websocket'] })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() socket: Socket;

  private logger: Logger = new Logger('AppChatGateway');

  constructor(
    private readonly chatService: ChatService,
    private readonly usersOnlineService: UsersOnlineRegistry,
    private readonly chatRoomsRegistry: ChatRoomsRegistry,
  ) {}

  @SubscribeMessage(ChatEventsToServer.SendToServer)
  receive(client: Socket, payload: string) {
    this.logger.log(`GetMessage ${client}, ${payload}`);

    let data: IMessagePayload;
    try {
      data = JSON.parse(payload);
    } catch (error) {
      throw new HttpException(
        `error parsing ${ChatEventsToServer.SendToServer} payload`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (this.usersOnlineService.isUserOnline(data.to)) {
      const room = this.chatRoomsRegistry.findRoomBy([data.from, data.to]);

      if (room) {
        this.socket
          .to(room.id)
          .emit(ChatEventsToClient.SendToClient, JSON.stringify(data));
      }
    }
  }

  @SubscribeMessage(ChatEventsToServer.OpenChat)
  openChat(client: Socket, payload: string) {
    this.logger.log(`Opened chat for ${JSON.stringify(payload)}`);

    let data: IOpenChatPayload;
    try {
      data = JSON.parse(payload);
    } catch (error) {
      throw new HttpException(
        `error parsing ${ChatEventsToServer.OpenChat} payload`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const room = this.chatRoomsRegistry.getRoomFor(Object.values(data));
    client.join(room.id);
  }

  @SubscribeMessage(ChatEventsToServer.CloseChat)
  closeChat(client: Socket, payload: string) {
    this.logger.log(`Closed chat for ${JSON.stringify(payload)}`);

    let data: IOpenChatPayload;
    try {
      data = JSON.parse(payload);
    } catch (error) {
      throw new HttpException(
        `error parsing ${ChatEventsToServer.OpenChat} payload`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const room = this.chatRoomsRegistry.findRoomBy(Object.values(data));
    if (!room) return;

    const { id } = client.handshake.auth;
    const isSomebodyHere = this.chatRoomsRegistry.anybodyElsePresent(
      room.id,
      id,
    );

    if (!isSomebodyHere) {
      this.chatRoomsRegistry.closeRoom(room.id);
    }
  }

  send(client: Socket, payload: string): void {
    // this.socket.emit(ChatEventsToClient.MsgToClient, payload);
  }

  afterInit(server: Socket) {
    this.logger.log('Init');
    // this.server.of('/chat').on('create-room', (room) => {
    //   console.log(`SERVER CREATED A ROOM ${room}`);
    // });
  }

  handleDisconnect(client: Socket) {
    const { id } = client.handshake.auth;
    this.usersOnlineService.setUserOnline(id, false);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    const { id } = client.handshake.auth;
    this.usersOnlineService.setUserOnline(id, true);
    this.logger.log(`Client connected: ${client.id} ${id}`);
  }

  // WORKAROUND
  get server(): Server {
    return (this.socket as any).server;
  }
}
