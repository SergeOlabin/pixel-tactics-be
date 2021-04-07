import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CharactersRegistryModule } from '../../shared/registries/static/characters-registry/characters-registry.module';
import { GameState, GameStateSchema } from '../game/schemas/game-state.schema';
import { GameStateService } from './game-state.service';
import { MoveCharacterService } from './helper-services/move-character.service';
import { NextTurnService } from './helper-services/next-turn.service';
import { PlayCardService } from './helper-services/play-card.service';

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
    NextTurnService,
    PlayCardService,
    GameStateService,
    MoveCharacterService,
  ],
  exports: [GameStateService],
})
export class GameStateModule {}
