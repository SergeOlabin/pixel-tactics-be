import { Body, Controller, Post } from '@nestjs/common';
import { StartGameDto } from './dto/start-game.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  startGame(@Body() startGameDto: StartGameDto) {
    let { playerIds } = startGameDto;

    if (typeof playerIds === 'string') {
      playerIds = JSON.parse(playerIds);
    }

    console.log('startGameDto', startGameDto.playerIds);
    this.gameService.startGame(playerIds);
  }
}
