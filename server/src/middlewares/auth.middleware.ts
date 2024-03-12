import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as cookieParser from 'cookie-parser';
import { AuthService } from '../services/auth.service';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    cookieParser()(req, res, () => {});
    const token = req.cookies['token'];
    if (token) {
      const decoded = await this.authService.decodeJwtToken(token);
      req['user'] = decoded;
    }

    next();
  }
}
