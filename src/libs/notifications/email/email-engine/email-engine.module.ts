import { Module } from '@nestjs/common';
import { EmailEngineService } from './email-engine.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import * as path from 'path';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();
const configService = new ConfigService();

const templatePath = () => {
  // Get the root directory of project (where NestJS application is located)
  const rootDir = process.cwd(); // This gets the current working directory

  // Construct the path to the 'dist' folder
  const distFolderPath = path.join(rootDir, 'dist');

  // Construct the path to the 'mail templates' folder
  return path.join(distFolderPath, 'resources', 'templates', 'mail');
}

const emailTransportConfig = () => {
  return process.env.NODE_ENV == 'development'?testEmailTransportConfig():liveEmailTransportConfig()
}

const testEmailTransportConfig = () => {
    return {
      host: configService.get<string>('TEST_EMAIL_HOST'),
      auth: {
        user: configService.get<string>('TEST_EMAIL_USER'),
        pass: configService.get<string>('TEST_EMAIL_PASS'),
      },
      port: configService.get<number>('TEST_EMAIL_PORT'),
    }
}

const liveEmailTransportConfig = () => {
  return {
    host: configService.get<string>('LIVE_EMAIL_HOST'),
    auth: {
      user: configService.get<string>('LIVE_EMAIL_USER'),
      pass: configService.get<string>('LIVE_EMAIL_PASS'),
    },
    port: configService.get<number>('LIVE_EMAIL_PORT'),
  }
}


@Module({
  imports: [
    MailerModule.forRoot({
      transport: emailTransportConfig(),
      template: {
        dir: `${templatePath()}`,
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      }
    }),
  ],
  providers: [EmailEngineService],
  exports: [EmailEngineService]
})
export class EmailEngineModule {}
