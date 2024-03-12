import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const noAuth = this.reflector.get<boolean>('noAuth', context.getHandler());
    if (noAuth) {
      return true;
    } else {
      // 检查是否有用户信息，如果没有，抛出异常
      const isExpire = request.user && request.user.exp < Date.now();
      if (!request.user || isExpire) {
        throw new UnauthorizedException('未登录');
      }

      return true;
    }
  }
}
