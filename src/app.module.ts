import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGatewayAddonsService } from './resources/app-gateway/app-gateway-addons';
import { AppGateway } from './resources/app-gateway/app.gateway';
import { AuthModule } from './resources/auth/auth.module';
import { CatsModule } from './resources/cats/cats.module';
import { ChatModule } from './resources/chat/chat.module';
import { GameModule } from './resources/game/game.module';
import { UsersModule } from './resources/users/users.module';
import { UsersOnlineModule } from './shared/services/users-online.module';

// TODO: USE ENV VARS
const DB_NAME = 'pixel-mongo-db';
const USERNAME = 'serge';
const PASSWORD = '823rZWuibNbczsF';

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
    UsersOnlineModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, AppGatewayAddonsService],
})
export class AppModule {}
