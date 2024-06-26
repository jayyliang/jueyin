import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import axios from 'axios';
import {
  CreateUserDto,
  LoginDto,
  UpdateUserInfoDto,
} from '../../dtos/user.dto';
import { EmailService } from '../../services/email.service';
import { RedisService } from '../../services/redis.service';
import { generateRandomNumber, hashPassword } from '../../utils';
import { VERIFY_CODE_PREFIX } from '../../utils/constant';
import { AuthService } from '../../services/auth.service';
import { NoAuth } from 'src/decorators/no-auth.decorator';
import { error } from 'console';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private siteKey: string;
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private emailService: EmailService,
    private redisService: RedisService,
    private authService: AuthService,
  ) {
    const configService = new ConfigService();
    this.siteKey = configService.get<string>('SERVER_SITE_KEY', '');
  }

  private async refreshCount(email: string) {
    const redisClient = this.redisService.getClient();
    const key = `code::count::${email}`;
    let countRes = await redisClient.get(key);
    const exist = await redisClient.exists(key);
    const count = Number(countRes);
    if (exist && count > 5) {
      throw Error('请求太过频繁，请稍后再试');
    }
    if (exist) {
      const ttl = await redisClient.ttl(key);
      await redisClient.set(key, count + 1);
      await redisClient.expire(key, ttl);
    } else {
      await redisClient.setex(key, 1, 60 * 60 * 12); // 一天
    }
  }

  async sendVerifyCode(
    email: string,
    googleCode: string,
    remoteip: string,
  ): Promise<string> {
    if (!googleCode) {
      throw new Error('验证code不可为空');
    }
    const cache = await this.redisService.get(`code::cache::${email}`);
    if (cache) {
      throw Error('请稍后再发送验证码');
    }
    this.refreshCount(email);
    await this.redisService.set(`code::cache::${email}`, true, 60);
    const res = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        secret: this.siteKey,
        response: googleCode,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    if (!res.data.success) {
      throw Error('非法验证');
    }
    const code = generateRandomNumber();
    const text = `您的验证码是:${code}，5分钟内有效`;
    await this.emailService.sendMail(email, 'jueyin注册', text);
    await this.redisService.set(`${VERIFY_CODE_PREFIX}:${email}`, code, 5 * 60);
    return code;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password } = createUserDto;
    const code = await this.redisService.get(`${VERIFY_CODE_PREFIX}:${email}`);
    if (!code) {
      throw new Error('验证码已过期');
    }
    const isEmailExist = await this.getUserByEmail(email);
    if (isEmailExist) {
      throw new Error('用户已存在');
    }
    const user = this.userRepository.create({
      email,
      password: hashPassword(password, email),
      username: `用户${Date.now()}`,
    });
    const res = await this.userRepository.save(user);
    return res;
  }

  async login(user: LoginDto) {
    const entity = await this.getUserByEmailAndPassword(
      user.email,
      hashPassword(user.password, user.email),
    );
    if (!entity) {
      throw new Error('邮箱或密码错误');
    }
    const { id, email } = entity;
    const token = this.authService.generateJwtToken({ id, email });
    return token;
  }

  async getUserByEmailAndPassword(email: string, password: string) {
    return this.userRepository.findOne({ where: { email, password } });
  }

  async updateUserInfo(id: number, userInfo: UpdateUserInfoDto) {
    const res = await this.userRepository.update({ id }, userInfo);
    return res;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserInfo(id: number): Promise<Omit<UserEntity, 'password'> | null> {
    const userInfo = await this.userRepository.findOne({ where: { id } });
    if (!userInfo) {
      return null;
    }
    delete userInfo.password;
    return userInfo;
  }

  async getUserInfoById(id: number) {
    const userInfo = await this.userRepository.findOne({
      where: { id },
      select: ['avatar', 'id', 'info', 'username'],
    });
    return userInfo;
  }
}
