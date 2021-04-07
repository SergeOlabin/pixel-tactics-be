import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IPlayerState } from '../../../game-data/types/game-types';
import { GameStateService } from '../../game-state/game-state.service';
import { BoardStateAddon } from '../addons/board-state.addon';
import { PlayersAddon } from '../addons/players-state.addon';
import { TurnStateAddon } from '../addons/turn-state.addon';
import { GAME_STATE_CONTROLLER_FACTORY_TOKEN } from '../constants/tokens';
import { GameStateControllerFactoryType } from '../factories/game-state-controller/game-state-controller.factory';
import {
  GamesOnlineRegistry,
  IGameOnlineCfg,
} from '../registries/games-online.registry';
import { GameState, GameStateDocumentType } from '../schemas/game-state.schema';

@Injectable()
export class GameInitService implements OnModuleInit, OnModuleDestroy {
  private playersAddon = new PlayersAddon();
  private boardStateAddon = new BoardStateAddon();
  private turnStateAddon = new TurnStateAddon();

  constructor(
    @InjectModel(GameState.name)
    private readonly gameStateModel: Model<GameStateDocumentType>,
    @Inject(GAME_STATE_CONTROLLER_FACTORY_TOKEN)
    private gameStateControllerFactory: GameStateControllerFactoryType,
    private readonly gamesRegistry: GamesOnlineRegistry,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    await this.addGameStatesFromDbToRegistry();
  }

  onModuleDestroy() {
    this.gamesRegistry.reset();
  }

  async startGame(playerIds: string[], id?: string) {
    const _id = id || uuidv4();

    const board = this.boardStateAddon.createInitBoardState();
    const [players, firstPlayer] = this.playersAddon.createPlayersState(
      playerIds,
    );
    const turn = this.turnStateAddon.createTurnState(firstPlayer);

    const gameState = new GameState({
      _id,
      board,
      players,
      turn,
    });

    await this.gameStateModel.create(gameState);

    // add to registry
    const contextId = ContextIdFactory.create();
    this.moduleRef.registerRequestByContextId(
      {
        contextId,
        gameId: _id,
      },
      contextId,
    );

    console.log('contextId', contextId);

    const gameStateService = this.moduleRef.resolve(
      GameStateService,
      contextId,
      { strict: false },
    );

    this.gamesRegistry.addItems([this.createGameControllerCfg(_id, playerIds)]);

    return [gameState, _id];
  }

  finishGame(gameId: string) {
    this.gameStateModel.deleteOne({ _id: gameId });
  }

  createGameControllerCfg(_id: string, userIds: string[]): IGameOnlineCfg {
    return {
      _id,
      userIds,
      controller: this.gameStateControllerFactory.create(_id),
    };
  }

  private async addGameStatesFromDbToRegistry() {
    const cfgMaps = (await this.gameStateModel.find().exec()).map((v) => {
      const playersState = Object.values(v.players) as IPlayerState[];
      const userIds = playersState.map((state) => state.userId);

      return this.createGameControllerCfg(v._id, userIds);
    });

    this.gamesRegistry.addItems(cfgMaps);
    console.log('ALL GAMES', JSON.stringify(this.gamesRegistry.getItems()));
  }
}
