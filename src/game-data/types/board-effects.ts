import { CharacterList } from './character-list';

export enum BoardEffectTypes {}

export interface IBoardEffect {
  type: BoardEffectTypes;
  origin: CharacterList;
}
