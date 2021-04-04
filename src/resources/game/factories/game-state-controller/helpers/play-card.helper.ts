import { WsException } from '@nestjs/websockets';
import {
  IBoardCard,
  IPlayerBoard,
  IPlayerState,
  Players,
} from '../../../../../game-data/types/game-types';
import { IPlayCardPayload } from '../../../../app-gateway/types/game-event-types';
import { GameStateDocumentType } from '../../../schemas/game-state.schema';
import { GameInjectableProxyService as proxy } from '../../../services/game-injectable-proxy.service';

export class PlayCardHelper {
  static async play(
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
    const hero = proxy.charactersRegistry.getItem(cardType);

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
