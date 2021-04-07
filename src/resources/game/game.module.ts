import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Characters from '../../game-data/characters/v1';
import { GameStateToUserAdapterModule } from '../../shared/services/game-state-to-user-adapter/game-state-to-user.adapter.module';
import { UsersOnlineModule } from '../../shared/services/users-online.module';
import { GameGateway } from './game.gateway';
import { GamesOnlineRegistry } from './registries/games-online.registry';
import { PendingGamesRegistry } from './registries/pending-games.registry';
import { CharactersRegistry } from '../../shared/registries/static/characters-registry/characters-registry.service';
import { GameState, GameStateSchema } from './schemas/game-state.schema';
import { GameEffectsService } from './services/game-effects.service';
import { GameInitService } from './services/game-init.service';
import { GameInjectableProxyService } from './services/game-injectable-proxy.service';
import { CharactersRegistryModule } from '../../shared/registries/static/characters-registry/characters-registry.module';
import { GameStateModule } from '../game-state/game-state.module';
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
    CharactersRegistryModule,
    GameStateModule,
  ],
  providers: [
    GameGateway,
    GameInitService,
    GamesOnlineRegistry,
    PendingGamesRegistry,
    GameStateModelService,
    GameEffectsService,
    GameInjectableProxyService,
  ],
  exports: [GameGateway, GamesOnlineRegistry, GameStateModule],
})
export class GameModule {
  constructor(charactersRegistry: CharactersRegistry) {
    charactersRegistry.addItems([...Object.values(Characters)]);
  }
}
