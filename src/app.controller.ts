import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { User, UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  getAllUsers() {
    return this.userService.getAll();
  }

  @Post('auth/register')
  async register(@Body() user: User) {
    try {
      this.authService.register(user);
      return user;
    } catch (error: any) {
      throw BadRequestException;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
