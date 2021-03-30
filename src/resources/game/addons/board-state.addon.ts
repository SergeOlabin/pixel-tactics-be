import { CharacterList } from '../../../game-data/types/character-list';
import { IBoardStateClass, Players } from '../../../game-data/types/game-types';
import { shuffle } from '../../../shared/helpers/shuffle';

const CARDS_AMOUNT = 25;

export class BoardStateAddon {
  public createInitBoardState(): IBoardStateClass {
    return {
      [Players.Blue]: {
        hand: {
          cards: [],
        },
        unit: {},
        deck: {
          cards: shuffle(Object.values(CharacterList)),
          cardsLeft: CARDS_AMOUNT,
        },
      },
      [Players.Red]: {
        hand: {
          cards: [],
        },
        unit: {},
        deck: {
          cards: shuffle(Object.values(CharacterList)),
          cardsLeft: CARDS_AMOUNT,
        },
      },
    };
  }
}
