import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SignInDto } from '@app/rest/auth/dto/shared/sign-in.dto';
import { TJwtPayload, TTokens } from '@libs/types';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import * as bcrypt from 'bcrypt';
import { events } from '@config/constants';
import { UserLoggedInEvent } from '@app/rest/auth/events/user-logged-in.event';
import { ForgotPasswordEvent } from '@app/rest/auth/events/forgot-password.event';
import { ResetPasswordTokenDto } from '@app/rest/auth/dto/shared/reset-password-token.dto';
import { EntityManager } from 'typeorm';
import { generateSixDigitToken } from '@libs/helpers/char-generator';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UserEvent } from '../users/events/user.event';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
    private readonly entityManager: EntityManager,
  ) {}

  async login(signInDto: SignInDto): Promise<TTokens> {
    const { email, password } = signInDto;
    const user = await this.usersService.validateUser(email, password);

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    const newUser = await this.usersService.findOne(user.id);

    // Dispatch user logged in event
    this.eventEmitter.emit(events.USER_LOGGED_IN, new UserLoggedInEvent(user));

    return {
      ...tokens,
      user: newUser,
    };
  }

  async getTokens(userId: number, email: string): Promise<TTokens> {
    const jwtPayload: TJwtPayload = {
      userId: userId,
      email: email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: `${this.configService.get('JWT_AUTH_TOKEN_EXPIRATION')}`,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
        expiresIn: `${this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION',
        )}`,
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async updateRefreshTokenHash(
    userId: number,
    refresh_token: string,
  ): Promise<User> {
    const hash = await argon.hash(refresh_token);
    return await this.usersService.findOneByIdAndUpdate(userId, {
      refreshToken: hash,
    });
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<TTokens> {
    const user = await this.usersService.findOneById(userId);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    const new_user = await this.updateRefreshTokenHash(
      user.id,
      tokens.refresh_token,
    );

    return {
      ...tokens,
      user: new_user,
    };
  }

  async resendToken(email: string): Promise<boolean> {
    // Verify the token supplied
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerifiedAt) {
      throw new NotAcceptableException('User verified already');
    }

    // Emit a resend verification token event
    this.eventEmitter.emit(
      events.VERIFICATION_TOKEN_REQUEST,
      new UserEvent(user),
    );

    return true;
  }

  async forgotPassword(email: string): Promise<boolean> {
    // Verify the token supplied
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // create a token
    const code = generateSixDigitToken();

    await this.usersService.findOneByIdAndUpdate(user.id, {
      passwordResetToken: code,
    });

    // Emit a forgot password event
    this.eventEmitter.emit(
      events.FORGOT_PASSWORD,
      new ForgotPasswordEvent(user, code),
    );

    return true;
  }

  async resetPassword(
    resetPasswordToken: ResetPasswordTokenDto,
  ): Promise<boolean> {
    const { token, new_password } = resetPasswordToken;

    const user = await this.verifyResetPasswordToken(token);

    const hash = await bcrypt.hash(new_password, 10);

    await this.usersService.findOneByIdAndUpdate(user.id, {
      password: hash,
      passwordResetToken: null,
    });

    // Emit a password changed event
    this.eventEmitter.emit(events.PASSWORD_CHANGED, new UserEvent(user));

    return true;
  }

  async verifyResetPasswordWithTokenAndEmail(
    email: string,
    token: number,
  ): Promise<User> {
    // Verify the token supplied
    const user = await this.usersService.checkUserPasswordWithTokenAndEmail(
      email,
      token,
    );

    if (!user) {
      throw new NotAcceptableException('Invalid token');
    }

    return user;
  }

  async verifyResetPasswordToken(token: number): Promise<User> {
    // Verify the token supplied
    const user = await this.usersService.checkUserPasswordToken(token);

    if (!user) {
      throw new NotAcceptableException('Invalid token');
    }

    return user;
  }

  async verifyToken(token: number): Promise<TTokens> {
    // Verify the token supplied
    const user = await this.usersService.checkUserVerificationToken(token);

    if (!user) {
      throw new NotAcceptableException('Invalid token');
    }

    await this.usersService.findOneByIdAndUpdate(user.id, {
      emailVerificationToken: null,
      emailVerifiedAt: new Date(),
    });

    // Emit a user account verification event
    this.eventEmitter.emit(events.ACCOUNT_VERIFIED, new UserEvent(user));

    const userAccount = await this.usersService.findOne(user.id);

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    // Save the user data
    await this.entityManager.save<User>(userAccount);
    const new_user = await this.usersService.findOne(user.id);

    return {
      ...tokens,
      user: new_user,
    };
  }

  async logout(userId: number) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    await this.usersService.findOneByIdAndUpdate(userId, {
      refreshToken: null,
    });
  }

  async myProfile(userId: number): Promise<User> {
    return this.usersService.findOne(userId);
  }
}
