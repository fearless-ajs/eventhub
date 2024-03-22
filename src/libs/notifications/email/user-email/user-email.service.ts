import { Injectable } from '@nestjs/common';
import { appInfo } from '@config/constants';
import { EmailEngineService } from '../email-engine/email-engine.service';
import { User } from '@app/rest/users/entities/user.entity';

@Injectable()
export class UserEmailService {
  constructor(private readonly emailEngineService: EmailEngineService) {}

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

  async sendEmailChangedMessage(user: User) {
    const { email, emailVerificationToken } = user;
    const { appName } = appInfo;

    const payload = {
      user: {
        email: email,
        token: emailVerificationToken,
      },
    };

    const subject: string = `${appName} - EMAIL CHANGED`;
    await this.emailEngineService.sendHtmlEmail(
      [email],
      subject,
      `auth/email-changed`,
      payload,
    );
  }
}
