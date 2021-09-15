import { Injectable, Scope } from '@nestjs/common';
import { IAttackPayload } from '../../app-gateway/types/game-event-types';
import { IPrepare } from '../game-state.service';

@Injectable({
  scope: Scope.REQUEST,
})
export class AttackActionService {
  async attack(
    { gameState, playerMeta, playerBoard }: IPrepare,
    payload: IAttackPayload,
  ) {}
}
