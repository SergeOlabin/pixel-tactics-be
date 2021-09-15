import { ArgumentsHost, Inject, Injectable, Scope } from '@nestjs/common';
import { Reflector, REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Model } from 'mongoose';
import {
  IGameState,
  IPlayerBoard,
  IPlayerState,
  Players,
} from '../../game-data/types/game-types';
import {
  GameEventTypesToClient,
  GameEventTypes,
  IDrawCardPayload,
  IBaseGameEventPayload,
  ISelectLeaderPayload,
  IPlayCardPayload,
  IMoveCardPayload,
} from '../app-gateway/types/game-event-types';
import { IGameEvent } from '../app-gateway/types/game-socket-events';
import {
  GameState,
  GameStateDocumentType,
} from '../game/schemas/game-state.schema';
import { NextTurnActionService } from './action-services/next-turn-action.service';
import { PlayCardActionService } from './action-services/play-card-action.service';
import { v4 as uuid } from 'uuid';
import { WsExceptionType } from '../../shared/types/socket-exception.types';
import { MoveActionService } from './action-services/move-action.service';

function SubscribeEvent(event: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    debugger;
    console.log('target', target);
    console.log('propertyKey', propertyKey);
    console.log('descriptor', descriptor);
  };
}

@Injectable({
  scope: Scope.TRANSIENT,
})
export class GameStateService {
  private gameId: string;
  private uuid = uuid();

  constructor(
    @Inject(REQUEST) private readonly request: any,
    @InjectModel(GameState.name)
    public gameStateModel: Model<GameStateDocumentType>,
    private readonly nextTurnService: NextTurnActionService,
    private readonly playCardService: PlayCardActionService,
    private readonly moveCharacterService: MoveActionService,
    private readonly reflector: Reflector,
  ) {
    this.gameId = request.gameId as string;
  }

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

      case GameEventTypes.PlayCard:
        return [await this.playCard(event.payload as IPlayCardPayload)];

      case GameEventTypes.Move:
        return [await this.move(event.payload as IMoveCardPayload)];

      default:
        break;
    }
  }

  @SubscribeEvent(GameEventTypes.DrawCard)
  async drawCard(payload: IDrawCardPayload) {
    const {
      gameState,
      playerColor,
      playerBoard,
      playerMeta,
    } = await this.prepare(payload);

    const cardsAmount = payload.cardsAmount || 1;
    if (playerMeta.actionsMeta.available <= 0) {
      throw new WsException({
        type: WsExceptionType.Error,
        message: 'Not enough action points.',
      });
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

    const updatedState = this.nextTurnService.calculate(gameState);

    gameState.markModified('turn');
    gameState.markModified('players');

    await gameState.save();
    return updatedState.toObject();
  }

  async playCard(payload: IPlayCardPayload) {
    const updatedState = await this.playCardService.play(
      await this.prepare({ userId: payload.userId }),
      payload,
    );

    updatedState.markModified('board');
    updatedState.markModified('players');

    await updatedState.save();
    return updatedState.toObject();
  }

  async move(payload: IMoveCardPayload) {
    const updatedState = await this.moveCharacterService.move(
      await this.prepare({ userId: payload.userId }),
      payload,
    );

    updatedState.markModified('board');
    updatedState.markModified('players');

    await updatedState.save();
    return updatedState.toObject();
  }

  async getState() {
    console.log(
      'reflector',
      this.reflector.get('custom-meta', GameStateService),
    );

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

  private async prepare(payload: IBaseGameEventPayload): Promise<IPrepare> {
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

export interface IPrepare {
  gameState: GameStateDocumentType;
  playerColor: Players;
  playerBoard: IPlayerBoard;
  playerMeta: IPlayerState;
}
