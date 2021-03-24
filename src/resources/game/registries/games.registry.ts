import { Injectable } from '@nestjs/common';
import { RegistryService } from '../../../shared/registries/abstract.registry';
import { GameState } from '../schemas/game-state.schema';

@Injectable()
export class GamesRegistry extends RegistryService<GameState> {
  protected getItemKey(item: GameState): string {
    return item._id;
  }
}
