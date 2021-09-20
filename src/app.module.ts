import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@pixel-cluster-0.zvzvy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    ),
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    CatsModule,
    GameModule,
    UsersModule,
    AuthModule,
    ChatModule,
    UsersOnlineModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, AppGatewayAddonsService],
})
export class AppModule {}
