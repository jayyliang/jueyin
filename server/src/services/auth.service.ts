import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '../utils/constant';

@Injectable()
export class AuthService {
  private readonly jwtService: JwtService;
  constructor(@Inject(JwtService) jwtService: JwtService) {
    this.jwtService = jwtService;
  }
  generateJwtToken({ id, email }: { id: number; email: string }): string {
    const payload = { id, email };
    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: '7d',
    });
  }
  async decodeJwtToken(token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      });
      return {
        id: decoded.id,
        emial: decoded.email,
        iat: decoded.iat * 1000,
        exp: decoded.exp * 1000,
      };
    } catch (error) {
      return {};
    }
  }
}
