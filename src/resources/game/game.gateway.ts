import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { StartGameDto } from './dto/start-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('startGame')
  create(
    @MessageBody() startGameDto: StartGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.gameService.startGame(startGameDto.playerIds);
  }
}
