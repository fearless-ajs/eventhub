import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthEmailService } from '@libs/notifications/email/auth-email/auth-email.service';
import { LocalStrategy } from '@app/rest/auth/strategies/local.strategy';
import { JwtStrategy } from '@app/rest/auth/strategies/jwt.strategy';
import { RefreshTokenStrategy } from '@app/rest/auth/strategies/refresh-token.strategy';
import { EmailEngineModule } from '@libs/notifications/email/email-engine/email-engine.module';
import { FileSystemService } from '@libs/services/file-system/file-system.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthEmailService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    FileSystemService,
  ],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    EmailEngineModule,
  ],
})
export class AuthModule {}
