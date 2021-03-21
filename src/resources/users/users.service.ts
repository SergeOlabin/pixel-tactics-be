import { Injectable, OnModuleInit } from '@nestjs/common';
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

  async create(createCatDto: CreateUserDto): Promise<UserEntity> {
    const createdUser = new this.usersModel(createCatDto);
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

  async findByName(username: string) {
    return (await this.usersModel.findOne({ username }).exec()).toObject();
  }

  async findById(id: string) {
    return (await this.usersModel.findById(id).exec()).toObject();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
