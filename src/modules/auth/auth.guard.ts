/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Please provide token');
    }

    const token = authorization.replace(/bearer\s?/i, '').trim();

    try {
      const decoded = this.authService.validateToken(token);

      request.user = decoded;
      return true;
    } catch (err: any) {
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
