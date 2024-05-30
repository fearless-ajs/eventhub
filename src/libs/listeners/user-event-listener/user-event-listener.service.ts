import { Injectable } from '@nestjs/common';
import { OnEvent } from "@nestjs/event-emitter";
import { events } from "@config/constants";
import { UserEmailService } from '@libs/notifications/email/user-email/user-email.service';
import { UserEvent } from '@app/rest/users/events/user.event';
import { EntityManager } from 'typeorm';
import { Wallet } from '@app/rest/wallet/entities/wallet.entity';
import { Cart } from '@app/rest/carts/entities/cart.entity';

@Injectable()
export class UserEventListenerService {
  constructor(
    private readonly userEmailService: UserEmailService,
    private readonly entityManager: EntityManager
  ) {}

  @OnEvent(events.USER_CREATED)
  async dispatchUserSupportCreatedNotification (payload: UserEvent) {
    const { user } = payload;

    // Create a wallet for the user
    const wallet = this.entityManager.create(Wallet,{
      balance: 0,
      user
    });
    // save the wallet into the db
    await this.entityManager.save(wallet);

    // create a cart for the user
    const cart = this.entityManager.create(Cart,{
      user
    });
    // save the cart into the db
    await this.entityManager.save(cart);

    // Send a welcome message to the user
    await this.userEmailService.sendWelcomeMessage(user);
  }

  @OnEvent(events.EMAIL_CHANGED)
  async dispatchUserEmailChangedNotification (payload: UserEvent) {
    const { user } = payload;
    await this.userEmailService.sendEmailChangedMessage(user);
  }

}
