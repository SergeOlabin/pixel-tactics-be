import { Injectable } from '@nestjs/common';
import { ContextId } from '@nestjs/core';
import { RegistryService } from '../../../shared/registries/abstract.registry';
import { GameStateController } from '../factories/game-state-controller/game-state-controller.factory';

export interface IGameOnlineCfg {
  // mongoDB gameState _id
  _id: string;
  userIds: string[];
  // controller: GameStateController;
  contextId: ContextId;
}

/**
 * Some mapping for actual games,
 * for now contains controllers for each game
 */
@Injectable()
export class GamesOnlineRegistry extends RegistryService<IGameOnlineCfg> {
  protected getItemKey(item: IGameOnlineCfg): string {
    return item._id;
  }
}
