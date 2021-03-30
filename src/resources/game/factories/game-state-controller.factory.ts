import { FactoryProvider, OnModuleInit } from '@nestjs/common';
import { Model, Query } from 'mongoose';
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
        new GameStateController(gameId, gameStateModel.gameStateModel),
    };
  },
  inject: [GameStateModelService, GameGatewayService],
};

export type GameStateControllerFactoryType = {
  create: (gameId: string) => GameStateController;
};

export class GameStateController implements OnModuleInit {
  private gameStateQuery: Query<
    GameStateDocumentType,
    GameStateDocumentType,
    Record<string, any>
  >;

  constructor(
    private gameId: string,
    private readonly gameStateModel: Model<GameStateDocumentType>,
  ) {}

  async onModuleInit() {
    this.gameStateQuery = this.gameStateModel.findById(this.gameId);
  }

  async drawCard(payload: IDrawCardPayload, cardsAmount = 1) {
    const { userId } = payload;
    const gameState = await this.gameStateQuery.exec();
    const playerColor = this.getPlayerColor(gameState, userId);
    const playerBoard = gameState.board[playerColor];

    const cards = playerBoard.deck.cards.splice(0, cardsAmount);
    playerBoard.hand.cards.push(...cards);
    gameState.players[playerColor].actionsMeta.available -= 1;

    await gameState.save();

    return gameState.toObject();
  }

  private getPlayerColor(gameState: GameState, userId: string): Players {
    const { players } = gameState;
    return Object.keys(players).find(
      (color) => players[color].userId === userId,
    ) as Players;
  }
}
