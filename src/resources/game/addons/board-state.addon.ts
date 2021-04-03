import { CharacterList } from '../../../game-data/types/character-list';
import {
  IBoardStateClass,
  IPlayerUnit,
  Players,
  Positions,
  Waves,
} from '../../../game-data/types/game-types';
import { shuffle } from '../../../shared/helpers/shuffle';

const CARDS_AMOUNT = 25;

export class BoardStateAddon {
  public createInitBoardState(): IBoardStateClass {
    return {
      [Players.Blue]: {
        hand: {
          cards: [],
        },
        unit: emptyUnit,
        deck: {
          cards: shuffle(Object.values(CharacterList)),
          cardsLeft: CARDS_AMOUNT,
        },
      },
      [Players.Red]: {
        hand: {
          cards: [],
        },
        unit: emptyUnit,
        deck: {
          cards: shuffle(Object.values(CharacterList)),
          cardsLeft: CARDS_AMOUNT,
        },
      },
    };
  }
}

const emptyUnit: IPlayerUnit = {
  [Waves.Vanguard]: {
    [Positions.Left]: null,
    [Positions.Center]: null,
    [Positions.Right]: null,
  },
  [Waves.Flank]: {
    [Positions.Left]: null,
    [Positions.Right]: null,
  },
  [Waves.Rear]: {
    [Positions.Left]: null,
    [Positions.Center]: null,
    [Positions.Right]: null,
  },
};
