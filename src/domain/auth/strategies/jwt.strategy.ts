import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';




@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    //private readonly authenticationService: AuthenticationService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
    
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.SECRET,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }


  async validate(payload: any) {
    return {
      userId: payload.userId,
      role: payload.role,
    };
  }
}
