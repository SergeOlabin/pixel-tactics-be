import { Injectable } from '@nestjs/common';
import { RegistryService } from '../registries/abstract.registry';

export interface IUserOnlineCfg {
  userId: string;
  clientId: string;
}

@Injectable()
export class UsersOnlineRegistry extends RegistryService<IUserOnlineCfg> {
  getItemKey(item: IUserOnlineCfg) {
    return item.userId;
  }

  isUserOnline(userId: string) {
    return Boolean(this.getItem(userId));
  }
}
