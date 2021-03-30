import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface IRoomCfg {
  id: string;
  memberIds: string[];
}

@Injectable()
export class ChatRoomsRegistry {
  private rooms: Record<string, IRoomCfg> = {};

  getRoomFor(memberIds: string[]) {
    const room = this.findRoomBy(memberIds);
    if (room) return room;

    return this.createRoom(memberIds);
  }

  createRoom(memberIds: string[]) {
    const id = uuidv4();
    this.rooms[id] = {
      id,
      memberIds: memberIds,
    };

    return this.rooms[id];
  }

  getRoom(id: string) {
    return this.rooms[id];
  }

  findRoomBy(memberIds: string[]): IRoomCfg | undefined {
    if (memberIds.length > 2) {
      throw new HttpException(
        "There's more than two users in the room",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.roomsToArray.find(
      (room) =>
        room.memberIds.includes(memberIds[0]) &&
        room.memberIds.includes(memberIds[1]),
    );
  }

  closeRoom(id: string) {
    delete this.rooms[id];
  }

  anybodyElsePresent(roomId: string, userId: string) {
    const room = this.rooms[roomId];

    if (!room) {
      throw new HttpException(
        'Room Not Found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return room.memberIds.filter((id) => id !== userId).length > 0;
  }

  get roomsToArray() {
    return Object.values(this.rooms) || [];
  }
}
