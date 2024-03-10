import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {
    this.redis = redis;
    this.redis.select(2);
  }
  set(key: string, value: any, expire?: number) {
    if (expire > 0) {
      return this.redis.setex(key, expire, value);
    } else {
      return this.redis.set(key, value);
    }
  }
  get(key: string) {
    return this.redis.get(key);
  }
  del(key: string) {
    return this.redis.del(key);
  }
}
