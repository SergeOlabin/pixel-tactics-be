import { GameStateDocumentType } from '../../../resources/game/schemas/game-state.schema';
import { CharacterList, IHero } from '../../types/character-list';

export const OverlordHero: IHero = class {
  static type: CharacterList.Overlord;
  static attack: 3;
  static health: 7;

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
