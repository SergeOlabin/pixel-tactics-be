import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Request } from 'express';
import { IJwtPayload } from '../auth/types/jwt-payload.types';
import { AddFriendDto } from './dto/add-friend.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log('createUserDto', createUserDto);
    return this.usersService.create(createUserDto);
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  // @Header('Access-Control-Allow-Origin', '*')
  async findAll() {
    console.log('GET ALL USERS');
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return (await this.usersService.findById(id))?.toObject();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
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

    const currentUser = request.user as IJwtPayload;

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
