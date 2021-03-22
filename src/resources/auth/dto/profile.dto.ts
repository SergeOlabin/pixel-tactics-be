import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { Roles } from '../../../constants/roles.constant';

export class GetProfileDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsNotEmpty()
  roles: Roles[];
}
