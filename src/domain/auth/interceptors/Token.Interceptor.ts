import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import type { User } from '../../user/domain/entity/User.js';

@Injectable()
export class TokenInterceptor implements NestInterceptor {


  constructor(private readonly jwtService: JwtService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<User>,
  ): Observable<User> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((user) => {
        return user as User;
      }),
    );
  }
}
