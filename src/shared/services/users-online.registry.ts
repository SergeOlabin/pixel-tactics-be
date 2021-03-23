import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersOnlineRegistry {
  private onlineMap: Record<string, boolean> = {};

  setUserOnline(userId: string, online: boolean) {
    this.onlineMap[userId] = online;
  }

  isUserOnline(userId: string) {
    return this.onlineMap[userId];
  }
}
