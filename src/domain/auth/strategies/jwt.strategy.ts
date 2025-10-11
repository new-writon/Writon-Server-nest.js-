import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('jwt.secret');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.access_token]),
      secretOrKey: secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request & { cookies?: Record<string, string> }, payload: any) {
    console.log('[JwtStrategy] Cookie access_token:', req.cookies?.access_token);
    console.log('[JwtStrategy] Payload:', payload);

    return {
      userId: payload.userId,
      role: payload.role,
    };
  }
}
