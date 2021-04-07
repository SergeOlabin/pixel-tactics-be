import { WsException } from '@nestjs/websockets';
import { Waves } from '../../../game-data/types/game-types';
import { WsExceptionType } from '../../../shared/types/socket-exception.types';
import { IPlayCardPayload } from '../../app-gateway/types/game-event-types';
import { IPrepare } from '../game-state.service';

export function checkWaveValidity(
  { gameState }: Partial<IPrepare>,
  targetWave: Waves,
) {
  if (gameState.turn.wave !== targetWave) {
    throw new WsException({
      type: WsExceptionType.Warning,
      message: 'You can perform an action only in an active wave.',
    });
  }
}
