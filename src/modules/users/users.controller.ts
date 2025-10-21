import { Body, Controller, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto, ResetPasswordDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.usersService.register(dto);
  }

  @Patch('activate-user')
  async activateUser(@Body('email') email: string) {
    return this.usersService.activateUser(email);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto);
  }

  @Post('forgot-password')
  async sendResetMail(@Body('email') email: string) {
    return this.usersService.sendResetMail(email);
  }

  @Patch('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.usersService.resetPassword(dto);
  }
}
