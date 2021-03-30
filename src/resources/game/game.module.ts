import { Module } from '@nestjs/common';
import { GameInitService } from './services/game-init.service';
import { GameInitGateway } from './game-init.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { GameState, GameStateSchema } from './schemas/game-state.schema';
import { GamesOnlineRegistry } from './registries/games-online.registry';
import { gameStateControllerFactory } from './factories/game-state-controller.factory';
import { GameStateModelService } from './services/game-state-model.service';
import { PendingGamesRegistry } from './registries/pending-games.registry';
import { UsersOnlineModule } from '../../shared/services/users-online.module';
import { GameStateToUserAdapterModule } from '../../shared/services/game-state-to-user-adapter/game-state-to-user.adapter.module';
import { GameGatewayService } from './game.gateway';

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
    GameInitGateway,
    GameGatewayService,
    GameInitService,
    GamesOnlineRegistry,
    PendingGamesRegistry,
    GameStateModelService,
    gameStateControllerFactory,
  ],
  exports: [GameInitGateway, GameGatewayService, GamesOnlineRegistry],
})
export class GameModule {}
