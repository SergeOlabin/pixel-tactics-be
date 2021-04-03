import { FactoryProvider } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { IGameState, Players } from '../../../../game-data/types/game-types';
import {
  GameEventTypes,
  GameEventTypesToClient,
  IBaseGameEventPayload,
  IDrawCardPayload,
  IPlayCardPayload,
  ISelectLeaderPayload,
} from '../../../app-gateway/types/game-event-types';
import { IGameEvent } from '../../../app-gateway/types/game-socket-events';
import { GAME_STATE_CONTROLLER_FACTORY_TOKEN } from '../../constants/tokens';
import {
  GameState,
  GameStateDocumentType,
} from '../../schemas/game-state.schema';
import { GameStateModelService } from '../../services/game-state-model.service';
import { NextTurnHelper } from './helpers/next-turn.helper';

export const gameStateControllerFactory: FactoryProvider = {
  provide: GAME_STATE_CONTROLLER_FACTORY_TOKEN,
  useFactory: (gameStateModel: GameStateModelService) => {
    return {
      create: (gameId: string) =>
        new GameStateController(gameId, gameStateModel.gameStateModel),
    };
  },
  inject: [GameStateModelService],
};

export type GameStateControllerFactoryType = {
  create: (gameId: string) => GameStateController;
};

export class GameStateController {
  constructor(
    private gameId: string,
    private readonly gameStateModel: Model<GameStateDocumentType>,
  ) {}

  async handleEvent(
    event: IGameEvent,
  ): Promise<[IGameState, GameEventTypesToClient] | [IGameState]> {
    switch (event.type) {
      case GameEventTypes.DrawCard:
        return [await this.drawCard(event.payload as IDrawCardPayload)];

      case GameEventTypes.DrawCardsForLeader:
        return [
          await this.getCardsForLeader(event.payload as IBaseGameEventPayload),
          GameEventTypesToClient.SelectLeaderReq,
        ];

      case GameEventTypes.SelectLeader:
        return [await this.setLeader(event.payload as ISelectLeaderPayload)];

      case GameEventTypes.NextTurn:
        return [await this.nextTurn(event.payload as IBaseGameEventPayload)];

      default:
        break;
    }
  }

  async drawCard(payload: IDrawCardPayload, cardsAmount = 1) {
    const {
      gameState,
      playerColor,
      playerBoard,
      playerMeta,
    } = await this.prepare(payload);

    if (playerMeta.actionsMeta.available <= 0) {
      throw new WsException('Not enough action points');
    }

    const cards = playerBoard.deck.cards.splice(0, cardsAmount || 1);
    playerBoard.hand.cards.push(...cards);
    gameState.players[playerColor].actionsMeta.available -= 1;
    gameState.board[playerColor].deck.cardsLeft -= cardsAmount;

    gameState.markModified('board');
    gameState.markModified('players');
    await gameState.save();

    return gameState.toObject();
  }

  async getCardsForLeader(payload: IBaseGameEventPayload) {
    const initDrawAmount = 4;
    const { gameState, playerColor, playerBoard } = await this.prepare(payload);

    const cards = playerBoard.deck.cards.splice(0, initDrawAmount);
    playerBoard.hand.cards.push(...cards);
    gameState.board[playerColor].deck.cardsLeft -= initDrawAmount;

    gameState.markModified('board');
    await gameState.save();

    return gameState.toObject();
  }

  async setLeader(payload: ISelectLeaderPayload) {
    const { gameState, playerBoard } = await this.prepare(payload);

    if (playerBoard.leader?.type) {
      throw new Error('Leader already set');
    }

    playerBoard.leader = {
      type: payload.type,
    };

    // remove from hand
    const { cards } = playerBoard.hand;
    const index = cards.indexOf(payload.type);
    if (index > -1) {
      cards.splice(index, 1);
    }

    gameState.markModified('board');
    await gameState.save();
    return gameState.toObject();
  }

  async nextTurn(payload: IBaseGameEventPayload) {
    const { gameState } = await this.prepare(payload);

    const updatedState = NextTurnHelper.calculate(gameState);

    gameState.markModified('turn');
    gameState.markModified('players');

    await gameState.save();
    return updatedState.toObject();
  }

  async playCard(payload: IPlayCardPayload) {
    const { toPlace, cardType } = payload;
    const { gameState, playerBoard, playerMeta } = await this.prepare(payload);

    if (playerMeta.actionsMeta.available <= 0) {
      throw new WsException('Not enough action points.');
    }

    const position = playerBoard.unit[toPlace.wave][toPlace.position];

    if (position) {
      if (playerMeta.actionsMeta.available <= 0) {
        throw new WsException('Field is taken byu another hero.');
      }
    }

    const { cards } = playerBoard.hand;
    const cardInHandIdx = cards.findIndex((card) => card === cardType);
    if (cardInHandIdx < 0) {
      throw new WsException('Card not found in the players hand.');
    }

    cards.splice(cardInHandIdx, 1);
    // TODO: create new Class here
    // const boardCardModel = {

    // };
    // playerBoard.unit[toPlace.wave][toPlace.position] =
  }

  async getState() {
    const gameState = await this.getModel();
    return gameState?.toObject();
  }

  private getPlayerColor(gameState: GameState, userId: string): Players {
    const players = gameState.players;
    return Object.keys(players).find(
      (color) => players[color].userId === userId,
    ) as Players;
  }

  private async getModel() {
    return await this.gameStateModel.findById(this.gameId).exec();
  }

  private async prepare(payload: IBaseGameEventPayload) {
    const { userId } = payload;

    const gameState = await this.getModel();
    const playerColor = this.getPlayerColor(gameState, userId);
    const playerBoard = gameState.board[playerColor];
    const playerMeta = gameState.players[playerColor];

    return {
      gameState,
      playerColor,
      playerBoard,
      playerMeta,
    };
  }
}
