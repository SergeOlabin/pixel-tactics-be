import { PartialType } from '@nestjs/mapped-types';
import { StartGameDto } from './start-game.dto';

export class UpdateGameDto extends PartialType(StartGameDto) {
  id: number;
}
