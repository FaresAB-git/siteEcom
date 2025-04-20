import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.['access_token']; // Récupère le token
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'DEFAULT_SECRET'),
    });
  }

  validate(payload: { sub: number; email: string; iat: number; exp: number }) {
    console.log({ payload });  // Log du payload pour voir s'il est bien validé
    return { userId: payload.sub, email: payload.email };
  }
}
