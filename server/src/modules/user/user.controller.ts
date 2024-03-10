import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto } from '../../dtos/user.dto';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getVerifyCode')
  async getVerifyCode(@Query('email') email: string): Promise<string> {
    if (!email) {
      throw new HttpException('邮箱不能为空', 500);
    }
    const code = await this.userService.sendVerifyCode(email);
    return code;
  }

  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<boolean> {
    await this.userService.createUser(user);
    return true;
  }

  @Post('login')
  async login(@Body() user: LoginDto, @Res() res: Response): Promise<boolean> {
    const token = await this.userService.login(user);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({
      message: 'success',
      data: true,
      status: 200,
    });
    return true;
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token');
    res.send(200);
  }

  @Post('updateUserInfo')
  async updateUserInfo(@Body() info: string): Promise<boolean> {
    await this.userService.updateUserInfo(info);
    return true;
  }
}
