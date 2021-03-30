import { FactoryProvider, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Players } from '../../../game-data/types/game-types';
import { IDrawCardPayload } from '../../app-gateway/types/game-socket-events';
import { GAME_STATE_CONTROLLER_FACTORY_TOKEN } from '../constants/tokens';
import { GameGatewayService } from '../game.gateway';
import { GameState, GameStateDocumentType } from '../schemas/game-state.schema';
import { GameStateModelService } from '../services/game-state-model.service';

export const gameStateControllerFactory: FactoryProvider = {
  provide: GAME_STATE_CONTROLLER_FACTORY_TOKEN,
  useFactory: (
    gameStateModel: GameStateModelService,
    gameGatewayService: GameGatewayService,
  ) => {
    return {
      create: (gameId: string) =>
        new GameStateController(
          gameId,
          gameStateModel.gameStateModel,
          gameGatewayService,
        ),
    };
  },
  inject: [GameStateModelService, GameGatewayService],
};

export type GameStateControllerFactoryType = {
  create: (gameId: string) => GameStateController;
};

export class GameStateController implements OnModuleInit {
  private gameState: GameStateDocumentType;

  constructor(
    private gameId: string,
    private readonly gameStateModel: Model<GameStateDocumentType>,
    private readonly gameGatewayService: GameGatewayService,
  ) {
    console.log('uuid', this.gameGatewayService.uuid());
  }

  async onModuleInit() {
    this.gameState = await this.gameStateModel.findById(this.gameId).exec();
  }

  async drawCard(payload: IDrawCardPayload, cardsAmount = 1) {
    const { userId } = payload;
    const gameState = await this.gameStateModel.findById(this.gameId).exec();
    const playerColor = this.getPlayerColor(gameState, userId);

    const board = gameState.board[playerColor];
  }

  private getPlayerColor(gameState: GameState, userId: string): Players {
    const { players } = gameState;
    return Object.keys(players).find(
      (color) => players[color].userId === userId,
    ) as Players;
  }
}
