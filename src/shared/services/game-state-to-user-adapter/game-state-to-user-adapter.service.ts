import { Injectable } from '@nestjs/common';
import {
  IBoardStateAdaptedToPlayer,
  IGameStateAdaptedToPlayer,
  Players,
} from '../../../game-data/types/game-types';
import { GameState } from '../../../resources/game/schemas/game-state.schema';

@Injectable()
export class GameStateToUserAdapterService {
  public adapt(game: GameState, userId: string): IGameStateAdaptedToPlayer {
    const { _id, board, players, turn } = game;
    const playerColor = Object.keys(players).find(
      (key) => players[key].userId === userId,
    );

    const adaptedBoard = Object.keys(board).reduce(
      (acc: IBoardStateAdaptedToPlayer, playerColor: Players) => {
        acc[playerColor] = {
          unit: board[playerColor].unit,
        };

        return acc;
      },
      {} as IBoardStateAdaptedToPlayer,
    );

    const hand = board[playerColor].hand;

    return {
      _id,
      players,
      hand,
      board: adaptedBoard,
      turn,
    };
  }
}
