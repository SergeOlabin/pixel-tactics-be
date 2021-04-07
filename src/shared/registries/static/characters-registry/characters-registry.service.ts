import { Injectable } from '@nestjs/common';
import { IHero } from '../../../../game-data/types/character-list';
import { RegistryService } from '../../abstract.registry';

@Injectable()
export class CharactersRegistry extends RegistryService<IHero> {
  getItemKey(item: IHero) {
    return item.type;
  }
}
