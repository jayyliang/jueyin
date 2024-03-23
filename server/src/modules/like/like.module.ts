import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from '../../services/redis.service';
import { LikeEntity } from '../../entities/like.entity';
import { LikeController } from './like.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity])],
  controllers: [LikeController],
  providers: [LikeService, RedisService],
})
export class LikeModule {}
