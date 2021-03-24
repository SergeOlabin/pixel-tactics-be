import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BoardStateAddon } from '../addons/board-state.addon';
import { PlayersAddon } from '../addons/players-state.addon';
import { GAME_STATE_CONTROLLER_FACTORY_TOKEN } from '../constants/tokens';
import { GameStateControllerFactoryType } from '../factories/game-state-controller.factory';
import {
  ControllerToGamesRegistry,
  IGameControllersCfg,
} from '../registries/game-controllers.registry';
import { GameState, GameStateDocumentType } from '../schemas/game-state.schema';

@Injectable()
export class GameService implements OnModuleInit, OnModuleDestroy {
  private playersAddon = new PlayersAddon();
  private boardStateAddon = new BoardStateAddon();

  constructor(
    @InjectModel(GameState.name)
    private readonly gameStateModel: Model<GameStateDocumentType>,
    private readonly gamesRegistry: ControllerToGamesRegistry,
    @Inject(GAME_STATE_CONTROLLER_FACTORY_TOKEN)
    private gameStateControllerFactory: GameStateControllerFactoryType,
  ) {}

  onModuleInit() {
    this.addGameStatesFromDbToRegistry();
  }

  onModuleDestroy() {
    this.gamesRegistry.reset();
  }

  startGame(playerIds: string[]) {
    const _id = uuidv4();

    const gameState = new GameState({
      _id,
      board: this.boardStateAddon.createInitBoardState(),
      players: this.playersAddon.createPlayersState(playerIds),
    });

    this.gameStateModel.create(gameState);

    // add to registry
    this.gamesRegistry.addItems([this.createGameControllerCfg(_id)]);

    return gameState;
  }

  finishGame(gameId: string) {
    this.gameStateModel.deleteOne({ _id: gameId });
  }

  private async addGameStatesFromDbToRegistry() {
    const cfgMaps = (await this.gameStateModel.find().exec()).map((v) =>
      this.createGameControllerCfg(v._id),
    );

    this.gamesRegistry.addItems(cfgMaps);
    console.log('ALL GAMES', JSON.stringify(this.gamesRegistry.getItems()));
  }

  private createGameControllerCfg(_id: string): IGameControllersCfg {
    return {
      _id,
      controller: this.gameStateControllerFactory.create(_id),
    };
  }
}
