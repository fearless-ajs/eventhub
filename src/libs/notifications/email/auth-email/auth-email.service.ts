import { Injectable } from '@nestjs/common';
import { EmailEngineService } from '@libs/notifications/email/email-engine/email-engine.service';
import { appInfo } from '@config/constants';
import { User } from '@app/rest/users/entities/user.entity';

@Injectable()
export class AuthEmailService {
  constructor(private readonly emailEngineService: EmailEngineService) {}

  async sendUserLoggedInMessage(user: User, dateTime: string) {
    const { email, emailVerificationToken } = user;
    const { appName } = appInfo;

    const payload = {
      user: {
        email: email,
        token: emailVerificationToken,
      },
      dateTime,
    };

    const subject: string = `${appName.toUpperCase()} - SUCCESSFUL LOGIN NOTIFICATION`;
    await this.emailEngineService.sendHtmlEmail(
      [email],
      subject,
      `auth/user-logged-in`,
      payload,
    );
  }

  async sendWelcomeMessage(user: User) {
    const { email, emailVerificationToken } = user;
    const { appName } = appInfo;

    const payload = {
      user: {
        email: email,
        token: emailVerificationToken,
      },
    };

    const subject: string = `Welcome To ${appName}`;
    await this.emailEngineService.sendHtmlEmail(
      [email],
      subject,
      `auth/welcome-with-verification-token`,
      payload,
    );
  }

  async resendVerificationTokenMessage(user: User) {
    const { email, emailVerificationToken } = user;

    const payload = {
      user: {
        email: email,
        token: emailVerificationToken,
      },
    };

    const subject: string = `Resending Verification Token - Complete Your Account`;
    await this.emailEngineService.sendHtmlEmail(
      [email],
      subject,
      `auth/resend-verification-token`,
      payload,
    );
  }

  async sendAccountVerificationMessage(user: User) {
    const { email, emailVerificationToken } = user;
    const { appName } = appInfo;

    const payload = {
      user: {
        email: email,
        token: emailVerificationToken,
      },
    };
    const subject: string = `Account Verified - Welcome to ${appName}!`;
    await this.emailEngineService.sendHtmlEmail(
      [email],
      subject,
      'auth/account-verified',
      payload,
    );
  }

  async sendForgotPasswordMessage(user: User, token: number) {
    const { email } = user;
    const { appName } = appInfo;

    const payload = {
      user: {
        email,
        token,
      },
    };

    const subject: string = `Password Reset Request - Reset Your ${appName} Account`;
    await this.emailEngineService.sendHtmlEmail(
      [email],
      subject,
      'auth/forgot-password',
      payload,
    );
  }

  async sendPasswordUpdatedMessage(user: User) {
    const { email } = user;
    const { appName } = appInfo;

    const payload = {
      user: {
        email,
      },
    };

    const subject: string = ` Password Updated - ${appName} Account Security Notification`;
    await this.emailEngineService.sendHtmlEmail(
      [email],
      subject,
      'auth/password-updated',
      payload,
    );
  }
}
