import { Players, Waves } from '../../../../../game-data/types/game-types';
import { GameStateDocumentType } from '../../../schemas/game-state.schema';

export class NextTurnHelper {
  static calculate(gameState: GameStateDocumentType): GameStateDocumentType {
    const { currentPlayer, firstPlayer, wave } = gameState.turn;

    gameState.players[currentPlayer].actionsMeta.available =
      gameState.players[currentPlayer].actionsMeta.max;

    if (currentPlayer === firstPlayer) {
      gameState.turn.currentPlayer = NextTurnHelper.getOpponent(currentPlayer);

      return gameState;
    }

    const nextWave = NextTurnHelper.getNextWave(wave);

    if (currentPlayer !== firstPlayer) {
      gameState.turn.wave = nextWave;

      if (nextWave !== Waves.Vanguard) {
        gameState.turn.currentPlayer = NextTurnHelper.getOpponent(
          currentPlayer,
        );
      } else {
        gameState.turn.firstPlayer = currentPlayer;
      }
    }

    return gameState;
  }

  static getOpponent(player: Players) {
    switch (player) {
      case Players.Blue:
        return Players.Red;
      case Players.Red:
        return Players.Blue;

      default:
        break;
    }
  }

  static getNextWave(wave: Waves): Waves {
    switch (wave) {
      case Waves.Vanguard:
        return Waves.Flank;

      case Waves.Flank:
        return Waves.Rear;

      case Waves.Rear:
        return Waves.Vanguard;

      default:
        break;
    }
  }
}
