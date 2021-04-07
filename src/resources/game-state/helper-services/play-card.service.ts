import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import {
  IBoardCard,
  IPlayerBoard,
  IPlayerState,
  Players,
} from '../../../game-data/types/game-types';
import { IPlayCardPayload } from '../../app-gateway/types/game-event-types';
import { CharactersRegistry } from '../../../shared/registries/static/characters-registry/characters-registry.service';
import { GameStateDocumentType } from '../../game/schemas/game-state.schema';

@Injectable({
  scope: Scope.REQUEST,
})
export class PlayCardService {
  constructor(
    @Inject(REQUEST) private readonly request: any,
    private readonly charactersRegistry: CharactersRegistry,
  ) {
    console.log('PlayCardService request', request);
  }

  async play(
    {
      playerBoard,
      gameState,
      playerMeta,
    }: {
      gameState: GameStateDocumentType;
      playerColor: Players;
      playerBoard: IPlayerBoard;
      playerMeta: IPlayerState;
    },
    payload: IPlayCardPayload,
  ): Promise<GameStateDocumentType> {
    const { toPlace, cardType } = payload;

    if (playerMeta.actionsMeta.available <= 0) {
      throw new WsException('Not enough action points.');
    }

    const position = playerBoard.unit[toPlace.wave][toPlace.position];

    if (position) {
      if (playerMeta.actionsMeta.available <= 0) {
        throw new WsException('Field is taken by another hero.');
      }
    }

    const { cards } = playerBoard.hand;
    const cardInHandIdx = cards.findIndex((card) => card === cardType);
    if (cardInHandIdx < 0) {
      throw new WsException('Card not found in the players hand.');
    }

    cards.splice(cardInHandIdx, 1);
    const hero = this.charactersRegistry.getItem(cardType);

    if (!hero) {
      throw new WsException(
        `Hero with type ${cardType} not found in registry.`,
      );
    }

    // TODO: add effects here!
    const card: IBoardCard = {
      cardType,
      stats: {
        attack: hero.attack,
        health: hero.health,
      },
    };

    playerBoard.unit[toPlace.wave][toPlace.position] = card;

    return gameState;
  }
}
