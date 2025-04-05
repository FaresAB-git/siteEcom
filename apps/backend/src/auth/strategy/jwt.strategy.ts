import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'DEFAULT_SECRET'), // Valeur par défaut (potentiellement un probleme)
    });
  }

  // Méthode appelée automatiquement par Passport après la validation du token
  validate(payload: { sub: number; email: string, iat: number, exp: number }) {
    console.log({payload});
    return { userId: payload.sub, email: payload.email }; //sera mis dans req.user et etre recup dans le controller
  }

  
}
