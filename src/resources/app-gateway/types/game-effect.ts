import { CharacterList } from '../../../game-data/types/character-list';

export enum EffectTypes {}

export interface IEffect {
  type: EffectTypes;
  origin: CharacterList;
}
