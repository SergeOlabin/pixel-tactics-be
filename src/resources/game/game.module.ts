import { Module } from '@nestjs/common';
import { GameService } from './services/game.service';
import { GameGateway } from './game.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { GameState, GameStateSchema } from './schemas/game-state.schema';
import { ControllerToGamesRegistry } from './registries/game-controllers.registry';
import { GameController } from './game.controller';
import { gameStateControllerFactory } from './factories/game-state-controller.factory';
import { GameStateModelService } from './services/game-state-model.service';

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
    GameGateway,
    GameService,
    ControllerToGamesRegistry,
    GameStateModelService,
    gameStateControllerFactory,
  ],
  controllers: [GameController],
})
export class GameModule {}
