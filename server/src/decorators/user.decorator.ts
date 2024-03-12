import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) {
      return request.user;
    }
    return request.user ? request.user[data] : null;
  },
);
