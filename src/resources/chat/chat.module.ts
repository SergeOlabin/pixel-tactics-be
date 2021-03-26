import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UsersOnlineRegistry } from '../../shared/services/users-online.registry';
import { ChatRoomsRegistry } from './registry/chat-rooms.registry';

@Module({
  providers: [ChatGateway, ChatService, ChatRoomsRegistry],
  exports: [ChatGateway],
})
export class ChatModule {}
