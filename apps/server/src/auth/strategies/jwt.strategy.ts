import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { JwtPayload } from '@ddcp/types';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AbilityFactory } from '@/ability/ability.factory.js';
import { UserEntity } from '@/users/entities/user.entity.js';
import { UsersService } from '@/users/users.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    config: ConfigService,
    private readonly abilityFactory: AbilityFactory,
    private readonly usersService: UsersService
  ) {
    super({
      ignoreExpiration: config.getOrThrow('NODE_ENV') === 'development',
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('SECRET_KEY')
    });
  }

  /** This method is called after the token is validated by passport  */
  async validate(request: Request, { username }: JwtPayload): Promise<UserEntity> {
    const user = await this.getUser(username);
    request.ability = this.abilityFactory.createForUser(user);
    this.logger.verbose(`Validated Token for User: ${username}`);
    return user;
  }

  /** Returns the user associated with the JWT if they exist, otherwise throws UnauthorizedException */
  private async getUser(username: string): Promise<UserEntity> {
    let user: UserEntity;
    try {
      user = await this.usersService.findByUsername(username);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException(`Token is valid, but user does not exist: ${username}`);
      }
      throw error;
    }
    return user;
  }
}
