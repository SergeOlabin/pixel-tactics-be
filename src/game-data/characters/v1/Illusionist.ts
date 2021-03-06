import { GameStateDocumentType } from '../../../resources/game/schemas/game-state.schema';
import { CharacterList, IHero } from '../../types/character-list';

export const MascotHero: IHero = class {
  static type = CharacterList.Mascot;
  static attack = 1;
  static health = 4;

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
