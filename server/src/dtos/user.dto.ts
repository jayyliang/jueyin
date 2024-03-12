import { IsEmail, IsNotEmpty, Length, isNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @Length(6, 30, {
    message: '密码最小长度为6位，最大长度为30位',
  })
  password: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  code: string;
}

export class LoginDto {
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  email: string;
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}

export class UpdateUserInfoDto {
  @IsNotEmpty({
    message: '用户名不可为空',
  })
  username: string;
  @IsNotEmpty({
    message:'头像不可为空'
  })
  avatar: string;
  info?: string;
}
