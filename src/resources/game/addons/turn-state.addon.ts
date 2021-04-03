import {
  ITurnState,
  Players,
  Waves,
} from '../../../game-data/types/game-types';

export class TurnStateAddon {
  public createTurnState(firstPlayer: Players): ITurnState {
    return {
      firstPlayer,
      currentPlayer: firstPlayer,
      wave: Waves.Vanguard,
    };
  }
}
