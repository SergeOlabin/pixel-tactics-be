import { Injectable, Scope } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { IPlayerBoard } from '../../../game-data/types/game-types';
import { WsExceptionType } from '../../../shared/types/socket-exception.types';
import { IMoveCardPayload } from '../../app-gateway/types/game-event-types';
import { IPrepare } from '../game-state.service';
import { checkAvailableActionPoints } from '../helpers/check-available-action-points';
import { checkWaveValidity } from '../helpers/check-wave-validity';

@Injectable({
  scope: Scope.REQUEST,
})
export class MoveCharacterService {
  async move(
    { gameState, playerMeta, playerBoard }: IPrepare,
    payload: IMoveCardPayload,
  ) {
    checkAvailableActionPoints(playerMeta);
    checkWaveValidity({ gameState }, payload.fromPlace.wave);

    this.validateOrigin(playerBoard, payload);
    this.validateTarget(playerBoard, payload);

    const { fromPlace, toPlace } = payload;
    const card = playerBoard.unit[fromPlace.wave][fromPlace.position];
    playerBoard.unit[toPlace.wave][toPlace.position] = card;

    playerBoard.unit[fromPlace.wave][fromPlace.position] = null;
    playerMeta.actionsMeta.available -= 1;

    return gameState;
  }

  private validateOrigin(playerBoard: IPlayerBoard, payload: IMoveCardPayload) {
    const { fromPlace } = payload;
    const card = playerBoard.unit[fromPlace.wave][fromPlace.position];

    if (!card) {
      throw new WsException({
        type: WsExceptionType.Error,
        message: `No card found on the place: ${fromPlace.wave} / ${fromPlace.position}`,
      });
    }

    return true;
  }
  private validateTarget(playerBoard: IPlayerBoard, payload: IMoveCardPayload) {
    const { toPlace } = payload;
    const card = playerBoard.unit[toPlace.wave][toPlace.position];

    if (card) {
      throw new WsException({
        type: WsExceptionType.Error,
        message: `Position: ${toPlace.wave} / ${toPlace.position} is taken by ${card.cardType}`,
      });
    }

    return true;
  }
}
