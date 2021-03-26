import { Module } from '@nestjs/common';
import { GameService } from './services/game.service';
import { GameInitGateway } from './game.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { GameState, GameStateSchema } from './schemas/game-state.schema';
import { GamesOnlineRegistry } from './registries/games-online.registry';
import { GameController } from './game.controller';
import { gameStateControllerFactory } from './factories/game-state-controller.factory';
import { GameStateModelService } from './services/game-state-model.service';
import { PendingGamesRegistry } from './registries/pending-games.registry';
import { GameOnlineUsersRegistry } from './registries/game-online-users.registry';
import { GameStateToUserAdapterService } from './adapters/game-state-to-user.adapter';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GameState.name,
        schema: GameStateSchema,
      },
    ]),
  ],
  providers: [
    GameInitGateway,
    GameStateToUserAdapterService,
    GameService,
    GamesOnlineRegistry,
    PendingGamesRegistry,
    GameOnlineUsersRegistry,
    GameStateModelService,
    gameStateControllerFactory,
  ],
  controllers: [GameController],
  exports: [GameInitGateway],
})
export class GameModule {}
