import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './resources/cats/cats.module';
import { GameModule } from './resources/game/game.module';

@Module({
  imports: [CatsModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
