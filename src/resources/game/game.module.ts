import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Characters from '../../game-data/characters/v1';
import { GameStateToUserAdapterModule } from '../../shared/services/game-state-to-user-adapter/game-state-to-user.adapter.module';
import { UsersOnlineModule } from '../../shared/services/users-online.module';
import { gameStateControllerFactory } from './factories/game-state-controller/game-state-controller.factory';
import { GameGateway } from './game.gateway';
import { GamesOnlineRegistry } from './registries/games-online.registry';
import { PendingGamesRegistry } from './registries/pending-games.registry';
import { CharactersRegistry } from './registries/static/characters.registry';
import { GameState, GameStateSchema } from './schemas/game-state.schema';
import { GameEffectsService } from './services/game-effects.service';
import { GameInitService } from './services/game-init.service';
import { GameInjectableProxyService } from './services/game-injectable-proxy.service';
import { GameStateModelService } from './services/game-state-model.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GameState.name,
        schema: GameStateSchema,
      },
    ]),
    UsersOnlineModule,
    GameStateToUserAdapterModule,
  ],
  providers: [
    GameGateway,
    GameInitService,
    GamesOnlineRegistry,
    PendingGamesRegistry,
    CharactersRegistry,
    GameStateModelService,
    gameStateControllerFactory,
    GameEffectsService,
    GameInjectableProxyService,
  ],
  exports: [GameGateway, GamesOnlineRegistry],
})
export class GameModule {
  constructor(charactersRegistry: CharactersRegistry) {
    charactersRegistry.addItems([...Object.values(Characters)]);
  }
}
