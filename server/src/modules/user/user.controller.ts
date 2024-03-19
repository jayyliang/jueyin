import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  LoginDto,
  UpdateUserInfoDto,
} from '../../dtos/user.dto';
import { Response } from 'express';
import { User } from '../../decorators/user.decorator';
import { NoAuth } from '../..//decorators/no-auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getVerifyCode')
  @NoAuth()
  async getVerifyCode(@Query('email') email: string): Promise<string> {
    if (!email) {
      throw new HttpException('邮箱不能为空', 500);
    }
    const code = await this.userService.sendVerifyCode(email);
    return code;
  }

  @Post('register')
  @NoAuth()
  async register(@Body() user: CreateUserDto): Promise<boolean> {
    await this.userService.createUser(user);
    return true;
  }

  @Post('login')
  @NoAuth()
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

  @Get('getUserInfo')
  async getUserInfo(@User('id') userId: number) {
    return await this.userService.getUserInfo(userId);
  }

  @Post('updateUserInfo')
  async updateUserInfo(
    @Body() userInfo: UpdateUserInfoDto,
    @User('id') userId: number,
  ): Promise<boolean> {
    await this.userService.updateUserInfo(userId, userInfo);
    return true;
  }
  @Get('getUserInfoById/:id')
  async getUserInfoById(@Param('id') id: number) {
    return await this.userService.getUserInfoById(id);
  }
}
