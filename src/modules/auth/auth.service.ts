/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  validateToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch (err: any) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
