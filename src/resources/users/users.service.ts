import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { User, UserDocumentType } from './schemas/users.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  private users: UserEntity[];

  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UserDocumentType>,
  ) {}

  async onModuleInit() {
    this.users = await this.findAll();
  }

  async create(createCatDto: CreateUserDto): Promise<UserEntity> {
    const createdUser = new this.usersModel(createCatDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersModel.find().exec();
  }

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all users`;
  // }

  findByName(username: string) {
    return this.users.find((user) => user.username === username);
  }

  findById(id: string) {
    this.users.find((user) => user._id === id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
