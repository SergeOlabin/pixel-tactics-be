import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatEventsToClient, ChatEventsToServer } from './chat.events';
import { ChatService } from './chat.service';

@WebSocketGateway(3002, { namespace: 'chat', transports: ['websocket'] })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() socket: Socket;

  private logger: Logger = new Logger('AppChatGateway');

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage(ChatEventsToServer.MsgToServer)
  receive(client: Socket, payload: string) {
    this.logger.log(`RECEIVED msgToServer ${client}, ${payload}`);
    // return { event: 'msgToClient', data: 'SERVER REVEIVED THE MESSAGE' };
  }

  send(client: Socket, payload: string): void {
    this.socket.emit(ChatEventsToClient.MsgToClient, payload);
  }

  afterInit(server: Socket) {
    this.logger.log('Init');
    // this.server.of('/chat').on('create-room', (room) => {
    //   console.log(`SERVER CREATED A ROOM ${room}`);
    // });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // WORKAROUND
  get server(): Server {
    return (this.socket as any).server;
  }
}
