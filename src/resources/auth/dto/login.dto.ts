import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;
}
