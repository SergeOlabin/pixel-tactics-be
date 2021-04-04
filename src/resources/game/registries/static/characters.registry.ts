import { Injectable } from '@nestjs/common';
import { DragonMageHero } from '../../../../game-data/characters/v1/DragonMage';
import {
  CharacterList,
  IHero,
} from '../../../../game-data/types/character-list';
import { RegistryService } from '../../../../shared/registries/abstract.registry';

@Injectable()
export class CharactersRegistry extends RegistryService<IHero> {
  getItemKey(item: IHero) {
    return item.type;
  }
}
