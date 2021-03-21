import {
  Body,
  Controller,
  Get,
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
    }

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesMeta(Roles.Admin)
  @Get('profile')
  getProfile(@Req() request: Request) {
    return request.user;
  }
}
