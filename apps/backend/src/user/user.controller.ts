import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request){
    console.log({
      user: req.user,
    });
    return 'user info';
  }
}
