import { Injectable } from '@nestjs/common';
import { RegistryService } from '../../../shared/registries/abstract.registry';

export interface IPendingGameCfg {
  id: string;
  playerIds: string[];
}

@Injectable()
export class PendingGamesRegistry extends RegistryService<IPendingGameCfg> {
  getItemKey(item: IPendingGameCfg) {
    return item.id;
  }
}
