import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core/router/request/request-constants';
import { Players, Waves } from '../../../game-data/types/game-types';
import { GameStateDocumentType } from '../../game/schemas/game-state.schema';

@Injectable({
  scope: Scope.REQUEST,
})
export class NextTurnService {
  constructor(@Inject(REQUEST) private readonly request: any) {
    console.log('NextTurnService request', request);
  }

  calculate(gameState: GameStateDocumentType): GameStateDocumentType {
    const { currentPlayer, firstPlayer, wave } = gameState.turn;

    gameState.players[currentPlayer].actionsMeta.available =
      gameState.players[currentPlayer].actionsMeta.max;

    if (currentPlayer === firstPlayer) {
      gameState.turn.currentPlayer = this.getOpponent(currentPlayer);

      return gameState;
    }

    const nextWave = this.getNextWave(wave);

    if (currentPlayer !== firstPlayer) {
      gameState.turn.wave = nextWave;

      if (nextWave !== Waves.Vanguard) {
        gameState.turn.currentPlayer = this.getOpponent(currentPlayer);
      } else {
        gameState.turn.firstPlayer = currentPlayer;
      }
    }

    return gameState;
  }

  private getOpponent(player: Players) {
    switch (player) {
      case Players.Blue:
        return Players.Red;
      case Players.Red:
        return Players.Blue;

      default:
        break;
    }
  }

  private getNextWave(wave: Waves): Waves {
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
