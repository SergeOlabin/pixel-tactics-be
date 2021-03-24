import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BoardStateAddon } from './addons/board-state.addon';
import { PlayersAddon } from './addons/players-state.addon';
import { GamesRegistry } from './registries/games.registry';
import { GameState, GameStateDocumentType } from './schemas/game-state.schema';

@Injectable()
export class GameService {
  private playersAddon = new PlayersAddon();
  private boardStateAddon = new BoardStateAddon();

  constructor(
    @InjectModel(GameState.name)
    private readonly gameStateModel: Model<GameStateDocumentType>,
    private readonly gamesRegistry: GamesRegistry,
  ) {}

  startGame(playerIds: string[]) {
    const _id = uuidv4();

    const gameState = new GameState({
      _id,
      board: this.boardStateAddon.createInitBoardState(),
      players: this.playersAddon.createPlayersState(playerIds),
    });

    this.gameStateModel.create(gameState);

    this.gamesRegistry.addItems([gameState]);

    return gameState;
  }

  finishGame(gameId: string) {
    this.gameStateModel.deleteOne({ _id: gameId });
  }
}
