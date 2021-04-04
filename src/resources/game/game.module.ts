import { Module } from '@nestjs/common';
import { GameInitService } from './services/game-init.service';
import { GameGateway } from './game.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { GameState, GameStateSchema } from './schemas/game-state.schema';
import { GamesOnlineRegistry } from './registries/games-online.registry';
import { gameStateControllerFactory } from './factories/game-state-controller/game-state-controller.factory';
import { GameStateModelService } from './services/game-state-model.service';
import { PendingGamesRegistry } from './registries/pending-games.registry';
import { UsersOnlineModule } from '../../shared/services/users-online.module';
import { GameStateToUserAdapterModule } from '../../shared/services/game-state-to-user-adapter/game-state-to-user.adapter.module';
import { GameEffectsService } from './services/game-effects.service';
import { CharactersRegistry } from './registries/static/characters.registry';
import { GameInjectableProxyService } from './services/game-injectable-proxy.service';
import * as Characters from '../../game-data/characters/v1';
import { CharacterList } from '../../game-data/types/character-list';
import { AlchemistHero, BerserkerHero } from '../../game-data/characters/v1';

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
