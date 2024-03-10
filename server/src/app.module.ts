import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { RedisModule } from '@nestjs-modules/ioredis';
import { GlobalValidationPipe } from './pipes/global-validation.pipe';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { JWT_SECRET } from './utils/constant';
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


@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    getDatabaseConfig(),
    getRedisConfig(),
    JwtModule.register({}),
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
  ],
})
export class AppModule {}
