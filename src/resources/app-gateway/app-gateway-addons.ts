import { Injectable } from '@nestjs/common';
import { ChatGateway } from '../chat/chat.gateway';
import { GameInitGateway } from '../game/game.gateway';

@Injectable()
export class AppGatewayAddonsService {
  constructor(public chat: ChatGateway, public gameInit: GameInitGateway) {}
}
