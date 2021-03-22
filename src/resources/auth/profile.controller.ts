import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AddFriendDto } from '../users/dto/add-friend.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { IJwtPayload } from './types/jwt-payload.types';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  // @Header('Access-Control-Allow-Origin', '*')
  async getProfile(@Req() request: Request) {
    const reqUser = (<any>request).user;
    const user: any = await this.usersService.findByEmail(reqUser?.email);

    if (user) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  @Get('friends')
  @UseGuards(JwtAuthGuard)
  async getFriendsInfo(@Req() request: Request) {
    const currentUser = request.user as IJwtPayload;

    if (!currentUser) {
      throw new HttpException(
        'CURRENT USER UNAVAILABLE',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const info = this.usersService.getUserFriendsInfo(currentUser.sub.id);

    return (await info).map((v) => v.toObject());
  }

  @Post('add-friend')
  @UseGuards(JwtAuthGuard)
  async addFriendByEmail(
    @Body() addFriendDto: AddFriendDto,
    @Req() request: Request,
  ) {
    const { email } = addFriendDto;

    if (!email) {
      throw new HttpException('EMAIL IS NOT VALID', HttpStatus.BAD_REQUEST);
    }

    const currentUser = (<any>request).user as IJwtPayload;

    if (!currentUser) {
      throw new HttpException(
        'CURRENT USER UNAVAILABLE',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const friendEntity = await this.usersService.findByEmail(email);
    if (!friendEntity) {
      throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    }

    this.usersService.addFriend(currentUser.sub.id, friendEntity._id);
  }
}
