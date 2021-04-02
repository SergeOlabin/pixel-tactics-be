import { IsString, ValidateNested } from 'class-validator';
import { GameEventTypes } from '../types/game-event-types';
import { IGameEvent } from '../types/game-socket-events';

class Payload {
  userId: string;
  [key: string]: any;
}

export class GameEventDto implements IGameEvent {
  @IsString()
  type: GameEventTypes;
  @IsString()
  gameId: string;
  @ValidateNested()
  payload: Payload;
}
