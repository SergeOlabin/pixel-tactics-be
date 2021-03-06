import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io/dist/socket';
import { ChatGateway } from '../chat/chat.gateway';
import { GameGateway } from '../game/game.gateway';

@Injectable()
export class AppGatewayAddonsService {
  constructor(public chat: ChatGateway, public game: GameGateway) {}

  setServerToAddons(sever: Socket) {
    this.chat.setServer(sever);
    this.game.setServer(sever);
  }
}
