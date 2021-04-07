import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { IBoardCard } from '../../../game-data/types/game-types';
import { CharactersRegistry } from '../../../shared/registries/static/characters-registry/characters-registry.service';
import { IPlayCardPayload } from '../../app-gateway/types/game-event-types';
import { GameStateDocumentType } from '../../game/schemas/game-state.schema';
import { IPrepare } from '../game-state.service';
import { checkAvailableActionPoints } from '../helpers/check-available-action-points';
import { checkWaveValidity } from '../helpers/check-wave-validity';

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
    data: IPrepare,
    payload: IPlayCardPayload,
  ): Promise<GameStateDocumentType> {
    const { toPlace, cardType } = payload;
    const { playerBoard, gameState, playerMeta, playerColor } = data;

    checkAvailableActionPoints(playerMeta);
    checkWaveValidity(data, payload.toPlace.wave);

    const position = playerBoard.unit[toPlace.wave][toPlace.position];
    if (position) {
      throw new WsException('Field is taken by another hero.');
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
    playerMeta.actionsMeta.available -= 1;

    return gameState;
  }
}
