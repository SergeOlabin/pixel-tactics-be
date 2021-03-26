import { Module } from '@nestjs/common';
import { UsersOnlineModule } from '../../shared/services/users-online.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRoomsRegistry } from './registry/chat-rooms.registry';

@Module({
  imports: [UsersOnlineModule],
  providers: [ChatGateway, ChatService, ChatRoomsRegistry],
  exports: [ChatGateway],
})
export class ChatModule {}
