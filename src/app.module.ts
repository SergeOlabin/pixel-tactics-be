import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './resources/cats/cats.module';
import { GameModule } from './resources/game/game.module';
import { UsersModule } from './resources/users/users.module';
import { AuthModule } from './resources/auth/auth.module';
import { ChatModule } from './resources/chat/chat.module';

// TODO: USE ENV VARS
const DB_NAME = 'pixel-mongo-db';
const USERNAME = 'serge';
const PASSWORD = 'bB3vKcomXVOtTxxi';

@Module({
  imports: [
    CatsModule,
    GameModule,
    MongooseModule.forRoot(
      `mongodb+srv://${USERNAME}:${PASSWORD}@pixel-cluster-0.zvzvy.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    ),
    UsersModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
