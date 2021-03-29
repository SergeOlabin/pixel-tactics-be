import { Injectable } from '@nestjs/common';
import { GameState } from '../schemas/game-state.schema';

@Injectable()
export class GameStateToUserAdapterService {
  public adapt(game: GameState, userId: string) {
    return game;
  }
}
