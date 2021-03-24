import { Injectable } from '@nestjs/common';
import { RegistryService } from '../../../shared/registries/abstract.registry';
import { GameStateController } from '../factories/game-state-controller.factory';

export interface IGameControllersCfg {
  // mongoDB gameState _id
  _id: string;
  controller: GameStateController;
}

@Injectable()
export class ControllerToGamesRegistry extends RegistryService<IGameControllersCfg> {
  protected getItemKey(item: IGameControllersCfg): string {
    return item._id;
  }
}
