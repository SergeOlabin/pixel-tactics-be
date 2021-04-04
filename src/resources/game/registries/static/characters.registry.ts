import { Injectable } from '@nestjs/common';
import { DragonMageHero } from '../../../../game-data/characters/v1/DragonMage';
import { CharacterList } from '../../../../game-data/types/character-list';
import { RegistryService } from '../../../../shared/registries/abstract.registry';

export interface ICharacterCfg {
  type: CharacterList;
}

console.log('DragonMageHero', DragonMageHero);

@Injectable()
export class CharactersRegistry extends RegistryService<ICharacterCfg> {
  getItemKey(item: ICharacterCfg) {
    return item.type;
  }
}
