import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io/dist/socket';
import { ChatGateway } from '../chat/chat.gateway';
import { GameInitGateway } from '../game-init/game-init.gateway';

@Injectable()
export class AppGatewayAddonsService {
  constructor(public chat: ChatGateway, public gameInit: GameInitGateway) {}

  setServerToAddons(sever: Socket) {
    this.chat.setServer(sever);
    this.gameInit.setServer(sever);
  }
}
