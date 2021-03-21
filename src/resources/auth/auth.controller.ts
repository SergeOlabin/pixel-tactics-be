import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  testGet() {
    return 'auth GET';
  }

  // @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.authService.validateUser(username, password);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  test() {
    return 'rest';
  }
}
