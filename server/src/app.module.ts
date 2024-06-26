import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { LikeModule } from './modules/like/like.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { RedisModule } from '@nestjs-modules/ioredis';
import { GlobalValidationPipe } from './pipes/global-validation.pipe';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { JWT_SECRET, QUEUE } from './utils/constant';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { AuthGuard } from './guards/auth.guard';
import { CommonModule } from './modules/common/common.module';
import { NestMinioModule } from 'nestjs-minio';
import { ArticleModule } from './modules/article/article.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './services/schedule.service';
import { BullModule } from '@nestjs/bull';
import { QueueConsumerService } from './services/queue-consumer.service';
import { ArticleService } from './modules/article/article.service';
const getDatabaseConfig = () => {
  const configService = new ConfigService();
  return TypeOrmModule.forRoot({
    type: 'mysql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 3306),
    username: configService.get<string>('DB_USERNAME', 'myuser'),
    password: configService.get<string>('DB_PASSWORD', 'mypassword'),
    database: configService.get<string>('DB_DATABASE', 'mydatabase'),
    autoLoadEntities: true,
  });
};
const getRedisConfig = () => {
  const configService = new ConfigService();
  const host = configService.get<string>('REDIS_HOST', 'localhost');
  const port = configService.get<number>('REDIS_PORT', 6379);
  return RedisModule.forRoot({
    type: 'single',
    url: `redis://${host}:${port}`,
    options: {
      password: configService.get<string>('REDIS_PASSWORD', 'password'),
      db: 2,
    },
  });
};

const getMinioConfig = () => {
  const configService = new ConfigService();
  const endPoint = configService.get<string>('MINIO_ENDPOINT', 'localhost');
  const accessKey = configService.get<string>('MINIO_ACCESSKEY', 'accessKey');
  const secretKey = configService.get<string>('MINIO_SECRET_KEY', 'secretKey');

  return NestMinioModule.register({
    isGlobal: true,
    endPoint,
    port: 9000,
    accessKey,
    secretKey,
    useSSL: false,
  });
};

const getBullConfig = () => {
  const configService = new ConfigService();
  const host = configService.get<string>('REDIS_HOST', 'localhost');
  const port = configService.get<number>('REDIS_PORT', 6379);
  return BullModule.forRoot({
    redis: {
      host,
      port,
      db: 2,
      password: configService.get<string>('REDIS_PASSWORD', 'password'),
    },
  });
};

@Module({
  imports: [
    UserModule,
    CommonModule,
    ArticleModule,
    LikeModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    getDatabaseConfig(),
    getRedisConfig(),
    JwtModule.register({}),
    getMinioConfig(),
    ScheduleModule.forRoot(),
    getBullConfig(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    ScheduleService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
