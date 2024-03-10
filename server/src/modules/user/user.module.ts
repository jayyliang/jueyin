import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { EmailService } from '../../services/email.service';
import { RedisService } from '../../services/redis.service';
import { AuthService } from '../../services/auth.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, EmailService, RedisService, AuthService, JwtService],
})
export class UserModule {}
