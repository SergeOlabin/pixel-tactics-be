import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3002, { namespace: 'chat', transports: ['websocket'] })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppChatGateway');

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('msgToServer')
  receive(client: Socket, payload: string): void {
    this.logger.log(`RECEIVED msgToServer ${client}, ${payload}`);
  }

  send(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');

    setTimeout(() => {
      this.server.emit('msgToClient', 'HELLO SUKA');
    }, 1000);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
