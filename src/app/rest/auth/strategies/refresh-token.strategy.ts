import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TJwtPayload, TJwtPayloadWithRt } from "@libs/types";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('REFRESH_JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: TJwtPayload): TJwtPayloadWithRt {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();


    if (!refreshToken) throw new ForbiddenException('Invalid refresh token');

    return {
      ...payload,
      refreshToken,
    };
  }
}
