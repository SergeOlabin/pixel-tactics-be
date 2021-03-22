import { IsEmail, IsString } from 'class-validator';

export class AddFriendDto {
  @IsEmail()
  email: string;
}
