import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CharactersRegistryModule } from '../../shared/registries/static/characters-registry/characters-registry.module';
import { GameState, GameStateSchema } from '../game/schemas/game-state.schema';
import { GameStateService } from './game-state.service';
import { AttackActionService } from './action-services/attack-action.service';
import { MoveActionService } from './action-services/move-action.service';
import { NextTurnActionService } from './action-services/next-turn-action.service';
import { PlayCardActionService } from './action-services/play-card-action.service';

@Module({
  imports: [
    CharactersRegistryModule,
    MongooseModule.forFeature([
      {
        name: GameState.name,
        schema: GameStateSchema,
      },
    ]),
  ],
  providers: [
    NextTurnActionService,
    PlayCardActionService,
    GameStateService,
    MoveActionService,
    AttackActionService,
  ],
  exports: [GameStateService],
})
export class GameStateModule {}
