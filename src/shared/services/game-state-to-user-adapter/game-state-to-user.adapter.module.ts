import { Module } from '@nestjs/common';
import { GameStateToUserAdapterService } from './game-state-to-user-adapter.service';

@Module({
  providers: [GameStateToUserAdapterService],
  exports: [GameStateToUserAdapterService],
})
export class GameStateToUserAdapterModule {}
