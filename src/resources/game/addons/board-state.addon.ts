import { CharacterList } from '../../../game-data/types/character-list';
import { IBoardStateClass, Players } from '../../../game-data/types/game-types';
import { shuffle } from '../../../shared/helpers/shuffle';

export class BoardStateAddon {
  public createInitBoardState(): IBoardStateClass {
    return {
      [Players.Blue]: {
        hand: {
          cards: [],
        },
        unit: {},
        deck: shuffle(Object.values(CharacterList)),
      },
      [Players.Red]: {
        hand: {
          cards: [],
        },
        unit: {},
        deck: Object.values(CharacterList),
      },
    };
  }
}
