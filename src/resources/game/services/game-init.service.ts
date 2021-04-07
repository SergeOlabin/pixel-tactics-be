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

    // set to db
    await this.gameStateModel.create(gameState);

    // add to registry
    const gameCfg = await this.createGameStateCfg(_id, playerIds);
    this.gamesRegistry.addItems([gameCfg]);

    return [gameState, _id];
  }

  finishGame(gameId: string) {
    this.gameStateModel.deleteOne({ _id: gameId });
  }

  async createGameStateCfg(
    _id: string,
    userIds: string[],
  ): Promise<IGameOnlineCfg> {
    const contextId = ContextIdFactory.create();
    this.moduleRef.registerRequestByContextId(
      {
        contextId,
        gameId: _id,
      },
      contextId,
    );

    console.log('contextId', contextId);

    const gameStateService = await this.moduleRef.resolve(
      GameStateService,
      contextId,
      { strict: false },
    );

    return {
      _id,
      userIds,
      contextId,
    };
  }

  private async addGameStatesFromDbToRegistry() {
    const allEntries = await this.gameStateModel.find().exec();
    const cfgMaps = await Promise.all(
      allEntries.map(async (v) => {
        const playersState = Object.values(v.players) as IPlayerState[];
        const userIds = playersState.map((state) => state.userId);

        return await this.createGameStateCfg(v._id, userIds);
      }),
    );

    this.gamesRegistry.addItems(cfgMaps);
    console.log('ALL GAMES', JSON.stringify(this.gamesRegistry.getItems()));
  }
}
