import { Injectable } from '@nestjs/common';
import { RegistryService } from '../../../shared/registries/abstract.registry';
import { GameStateController } from '../factories/game-state-controller.factory';

export interface IGameOnlineCfg {
  // mongoDB gameState _id
  _id: string;
  controller: GameStateController;
}

@Injectable()
export class GamesOnlineRegistry extends RegistryService<IGameOnlineCfg> {
  protected getItemKey(item: IGameOnlineCfg): string {
    return item._id;
  }
}
