import { Injectable } from '@nestjs/common';
import { BaseGatewayAddon } from '../app-gateway/base-gateway-addon';
import { GameStateToUserAdapterService } from '../../shared/services/game-state-to-user-adapter/game-state-to-user-adapter.service';
import { v4 as uuid } from 'uuid';
import { GamesOnlineRegistry } from './registries/games-online.registry';
import { IDrawCardPayload } from '../app-gateway/types/game-socket-events';

@Injectable()
export class GameGatewayService extends BaseGatewayAddon {
  public uuid = uuid();

  constructor(
    private readonly gameStateToUserAdapterService: GameStateToUserAdapterService,
    private readonly gamesOnlineRegistry: GamesOnlineRegistry,
  ) {
    super();
  }

  drawCard(payload: IDrawCardPayload) {}
}
