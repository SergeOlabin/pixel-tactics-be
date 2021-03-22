import {
  Body,
  Controller,
  Header,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('login')
  // @UseGuards(LocalAuthGuard)
  @Header('Access-Control-Allow-Origin', '*')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    }

    return this.authService.login(user);
  }
}
