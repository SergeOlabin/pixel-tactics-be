import { Injectable, Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersOnlineRegistry } from '../../shared/services/users-online.registry';
import {
  ChatEventsToClient,
  ChatEventsToServer,
  IMessagePayload,
  IOpenChatPayload,
} from '../app-gateway/types/chat-socket-events';
import { ChatService } from './chat.service';
import { ChatRoomsRegistry } from './registry/chat-rooms.registry';

// @WebSocketGateway(3002, { namespace: 'chat', transports: ['websocket'] })
@Injectable()
export class ChatGateway {
  @WebSocketServer() socket: Socket;

  private logger: Logger = new Logger('AppChatGateway');

  constructor(
    private readonly chatService: ChatService,
    private readonly usersOnlineService: UsersOnlineRegistry,
    private readonly chatRoomsRegistry: ChatRoomsRegistry,
  ) {}

  receiveMessage(payload: IMessagePayload) {
    if (this.usersOnlineService.isUserOnline(payload.to)) {
      const room = this.chatRoomsRegistry.findRoomBy([
        payload.from,
        payload.to,
      ]);

      if (room) {
        this.socket.to(room.id).emit(ChatEventsToClient.SendToClient);
      }
    }
  }

  openChat(payload: IOpenChatPayload, client: Socket) {
    console.log('payload: IOpenChatPayload', payload);
    const room = this.chatRoomsRegistry.getRoomFor(Object.values(payload));
    client.join(room.id);
  }

  @SubscribeMessage(ChatEventsToServer.CloseChat)
  closeChat(payload: IOpenChatPayload, client: Socket) {
    const room = this.chatRoomsRegistry.findRoomBy(Object.values(payload));
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

  // WORKAROUND
  get server(): Server {
    return (this.socket as any).server;
  }
}
