import { CharacterList } from './character-list';

export enum EffectTypes {}

export interface IEffect {
  type: EffectTypes;
  origin: CharacterList;
}
