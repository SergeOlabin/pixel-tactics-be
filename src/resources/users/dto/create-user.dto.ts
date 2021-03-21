import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Roles } from '../../../constants/roles.constant';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  username: string;

  @IsNotEmpty()
  roles: Roles[];
}
