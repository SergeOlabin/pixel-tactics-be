import { WsException } from '@nestjs/websockets';
import { IPlayerState } from '../../../game-data/types/game-types';
import { WsExceptionType } from '../../../shared/types/socket-exception.types';

export function checkAvailableActionPoints(playerMeta: IPlayerState) {
  if (playerMeta.actionsMeta.available <= 0) {
    throw new WsException({
      type: WsExceptionType.Error,
      message: 'Not enough action points.',
    });
  }

  return true;
}
