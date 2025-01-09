import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        // If there's an error or user is not found, throw a custom error message
        if (err || !user) {
          throw err || new UnauthorizedException('برای انجام این عملیات ابتدا وارد شوید.');
        }
        return user;
    }
}
