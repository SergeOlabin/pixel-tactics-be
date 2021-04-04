import { GameStateDocumentType } from '../../../resources/game/schemas/game-state.schema';
import { CharacterList, IHero } from '../../types/character-list';

export const VampireHero: IHero = class {
  static type: CharacterList.Vampire;
  static attack: 2;
  static health: 6;

  static vanguardPower(gameState: GameStateDocumentType) {
    console.log('method not yet implemented');
  }
  static flankPower(gameState: GameStateDocumentType) {
    console.log('method not yet implemented');
  }
  static rearPower(gameState: GameStateDocumentType) {
    console.log('method not yet implemented');
  }
  static orderPower(gameState: GameStateDocumentType) {
    console.log('method not yet implemented');
  }
};
