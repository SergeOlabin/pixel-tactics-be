import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { User, UserDocumentType } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UserDocumentType>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const createdUser = new this.usersModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserEntity[]> {
    return (await this.usersModel.find().exec()).map((v) => v.toObject());
  }

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all users`;
  // }

  async findByEmail(email: string) {
    return (await this.usersModel.findOne({ email }).exec())?.toObject();
  }

  async findById(id: string) {
    return await this.usersModel.findById(id).exec();
  }

  async getUserFriendsInfo(userId: string) {
    const user = await (await this.usersModel.findById(userId))?.toObject();

    if (!user) {
      return null;
    }

    return await this.usersModel.find({ _id: { $in: user.friendIds } }).exec();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async addFriend(originUserId: string, targetUserId: string) {
    const currentUser = await this.findById(originUserId);
    const targetUser = await this.findById(targetUserId);

    if (!currentUser) {
      throw new HttpException(
        `User with id ${originUserId} not found`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!targetUser) {
      throw new HttpException(
        `User with id ${targetUserId} not found`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!currentUser.friendIds) {
      currentUser.friendIds = [];
    }
    if (currentUser.friendIds.indexOf(targetUserId) === -1) {
      currentUser.friendIds.push(targetUserId);
      currentUser.save();
    } else {
      console.warn('!!! VALIDATE ADDING DUPLICATED FRIENDS!!! ');
    }
  }
}
