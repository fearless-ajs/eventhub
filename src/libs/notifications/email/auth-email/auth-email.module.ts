import { Module } from '@nestjs/common';
import { EmailEngineModule } from '@libs/notifications/email/email-engine/email-engine.module';
import { AuthEmailService } from '@libs/notifications/email/auth-email/auth-email.service';

@Module({
  providers: [AuthEmailService],
  exports: [AuthEmailService],
  imports: [EmailEngineModule],
})
export class AuthEmailModule {}
