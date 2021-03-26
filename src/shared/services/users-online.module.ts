import { Module } from '@nestjs/common';
import { UsersOnlineRegistry } from './users-online.registry';

@Module({
  providers: [UsersOnlineRegistry],
  exports: [UsersOnlineRegistry],
})
export class UsersOnlineModule {}
