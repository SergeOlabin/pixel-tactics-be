import { Injectable } from '@nestjs/common';
import { RegistryService } from '../../../shared/registries/abstract.registry';

export interface IGameOnlineUserCfg {
  userId: string;
  clientId: string;
}

@Injectable()
export class GameOnlineUsersRegistry extends RegistryService<IGameOnlineUserCfg> {
  getItemKey(item: IGameOnlineUserCfg) {
    return item.userId;
  }
}
