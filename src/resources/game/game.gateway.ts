import { Injectable } from '@nestjs/common';
import { BaseGatewayAddon } from '../app-gateway/base-gateway-addon';
import { GameStateToUserAdapterService } from '../../shared/services/game-state-to-user-adapter/game-state-to-user-adapter.service';
import { GamesOnlineRegistry } from './registries/games-online.registry';
import { IDrawCardPayload } from '../app-gateway/types/game-events';

@Injectable()
export class GameGatewayService extends BaseGatewayAddon {
  constructor(
    private readonly gameStateToUserAdapterService: GameStateToUserAdapterService,
    private readonly gamesOnlineRegistry: GamesOnlineRegistry,
  ) {
    super();
  }
}
