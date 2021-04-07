import { CharacterList } from './character-list';

export enum CellEffectTypes {}

export interface ICellEffect {
  type: CellEffectTypes;
  origin: CharacterList;
}
