import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { LikeEntity } from '../../entities/like.entity';
import { EntityManager, Repository } from 'typeorm';
import { RedisService } from '../../services/redis.service';
import { ELike, ELikeType } from '../../utils/constant';
import { wait } from '../../utils/index';
@Injectable()
export class LikeService {
  private ttl: number;
  constructor(
    @InjectRepository(LikeEntity)
    private likeRepository: Repository<LikeEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private redisService: RedisService,
  ) {
    this.ttl = 3600; // 一小时
  }

  async toggleLike(params: {
    userId: number;
    targetId: number;
    type: ELikeType;
    value: ELike;
  }) {
    const { userId, targetId, type, value } = params;
    const LOCK_KEY = `${userId}::${targetId}::${type}::toggleLikeLock`;
    const canGetLock = await this.redisService.getLock(LOCK_KEY);
    if (!canGetLock) {
      console.log('toggleLike 获取锁失败');
      await wait();
      return this.toggleLike(params);
    }
    const record = await this.likeRepository.findOne({
      where: { userId, targetId, type },
    });
    if (record && record.value === value) {
      await this.redisService.unLock(LOCK_KEY);
      throw Error('不可重复操作');
    }

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      if (!record) {
        const likeEntity = new LikeEntity();
        likeEntity.targetId = targetId;
        likeEntity.type = type;
        likeEntity.userId = userId;
        likeEntity.value = value;
        await transactionalEntityManager.save(likeEntity);
      } else {
        const id = record.id;
        await transactionalEntityManager.update(LikeEntity, { id }, { value });
      }
      const isSuccess = await this.tryToFreshCache(params);

      if (!isSuccess) {
        await this.redisService.unLock(LOCK_KEY);
        throw Error('操作失败');
      }
    });
    await this.redisService.unLock(LOCK_KEY);
    return true;
  }

  private getSetKey(targetId: number, type: number) {
    return `${targetId}::${type}::likeSet`;
  }

  private async tryToFreshCache(
    params: {
      userId: number;
      targetId: number;
      type: ELikeType;
      value: ELike;
    },
    retry = 3,
  ) {
    if (retry === 0) {
      return false;
    }
    const { targetId, type, value, userId } = params;
    try {
      const pipeline = this.redisService.multi();
      const setKey = this.getSetKey(targetId, type);
      if (value === ELike.LIKE) {
        pipeline.sadd(setKey, userId);
      } else {
        pipeline.srem(setKey, userId);
      }
      pipeline.expire(setKey, this.ttl);
      await pipeline.exec();
      return true;
    } catch (error) {
      console.log('tryToFreshCache error', error);
      await wait();
      return this.tryToFreshCache(params, retry - 1);
    }
  }

  async getLikes(params: {
    targetId: number;
    type: ELikeType;
    userId: number;
  }) {
    const { targetId, type, userId } = params;
    const setKey = this.getSetKey(targetId, type);
    const cacheExsit = await this.redisService.exist(setKey);
    if (!cacheExsit) {
      await this.getLikeFromDbAndSetCache(params);
    }
    const count = await this.redisService.getSetLength(setKey);
    const isLike = await this.redisService.isMemberOfSet(setKey, userId);
    return { count, isLike };
  }

  private async getLikeFromDbAndSetCache(params: {
    targetId: number;
    type: ELikeType;
    userId: number;
  }) {
    const { targetId, type, userId } = params;
    const LOCK_KEY = `${targetId}::${type}::getLikesLock`;
    const canGetLock = await this.redisService.getLock(LOCK_KEY);
    if (!canGetLock) {
      console.log('getLikeFromDbAndSetCache 获取锁失败');
      await wait();
      return this.getLikeFromDbAndSetCache(params);
    }
    const setKey = this.getSetKey(targetId, type);
    const cacheExsit = await this.redisService.exist(setKey);
    if (cacheExsit) {
      await this.redisService.unLock(LOCK_KEY);
      return true;
    }
    const data = await this.likeRepository.find({
      where: {
        targetId,
        userId,
        type,
        value: ELike.LIKE,
      },
      select: ['userId'],
    });
    if (data.length !== 0) {
      await this.redisService.setAdd(
        setKey,
        data.map((item) => item.userId),
        this.ttl,
      );
    }
    await this.redisService.unLock(LOCK_KEY);
    return true;
  }
}
