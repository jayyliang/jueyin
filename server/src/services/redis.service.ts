import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {
    this.redis = redis;
    this.redis.select(2);
  }

  getClient() {
    return this.redis;
  }

  async set(key: string, value: any, expire?: number) {
    if (expire > 0) {
      return this.redis.setex(key, expire, value);
    } else {
      return this.redis.set(key, value);
    }
  }
  async get(key: string) {
    return this.redis.get(key);
  }
  async del(key: string) {
    return this.redis.del(key);
  }

  async ttl(key: string) {
    return this.redis.ttl(key);
  }

  async getLock(key: string) {
    // 10秒锁过期
    const res = await this.redis.setnx(key, 'lock');
    if (res) {
      await this.redis.expire(key, 10);
    }
    return res;
  }

  async unLock(key: string) {
    return this.del(key);
  }

  async expire(key: string, expire: number) {
    return this.redis.expire(key, expire);
  }

  async setAdd(key: string, value: any, expire?: number) {
    const exsit = await this.redis.exists(key);

    const res = await this.redis.sadd(key, value);
    if (!exsit && !!expire) {
      await this.expire(key, expire);
    }
    return res;
  }
  async setRemove(key: string, value: any) {
    return this.redis.srem(key, value);
  }
  async smembers(key: string) {
    return this.redis.smembers(key);
  }
  async getSetLength(setKey: string) {
    return this.redis.scard(setKey);
  }
  async exist(key: string) {
    return this.redis.exists(key);
  }
  async isMemberOfSet(setKey: string, member: string | number) {
    return (await this.redis.sismember(setKey, member)) === 1;
  }
  multi() {
    return this.redis.multi();
  }
  async exec() {
    return await this.redis.exec();
  }
}
