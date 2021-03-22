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
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { Request } from 'express';
import { RolesMeta } from '../../decorators/roles-meta.decorator';
import { Roles } from '../../constants/roles.constant';
import { RolesGuard } from './guards/roles.guard';
import { UsersService } from '../users/users.service';

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
    console.log('loginDto', loginDto);

    const { email, password } = loginDto;
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    }

    return this.authService.login(user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  // @RolesMeta(Roles.Admin)
  @Header('Access-Control-Allow-Origin', '*')
  async getProfile(@Req() request: Request) {
    const user: any = await this.userService.findByEmail(
      (request.user as any)?.email,
    );

    if (user) {
      const { password, ...result } = user;
      console.log('return user', result);

      return result;
    }

    return null;
  }
}
