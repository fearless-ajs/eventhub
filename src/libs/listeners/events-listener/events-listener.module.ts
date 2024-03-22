import { Module } from '@nestjs/common';
import { UserEventListenerService } from '@libs/listeners/user-event-listener/user-event-listener.service';
import { AuthEmailModule } from '@libs/notifications/email/auth-email/auth-email.module';
import { UserEmailModule } from '@libs/notifications/email/user-email/user-email.module';
import { AuthEventListenerService } from '../auth-event-listener/auth-event-listener.service';

@Module({
  providers: [UserEventListenerService, AuthEventListenerService],
  imports: [AuthEmailModule, UserEmailModule],
})
export class EventsListenerModule {}
