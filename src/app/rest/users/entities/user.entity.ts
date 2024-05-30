import { EventFeed } from '@app/rest/event-feeds/entities/event-feed.entity';
import { UserService } from '@app/rest/user-services/entities/user-service.entity';
import { AbstractEntity } from '@libs/database/abstract.entity';
import { Column, Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Wallet } from '@app/rest/wallet/entities/wallet.entity';
import { Cart } from '@app/rest/carts/entities/cart.entity';

@Entity({ name: 'users' })
export class User extends AbstractEntity<User> {
  @Column()
  lastname: string;

  @Column()
  firstname: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt?: Date;

  @Column({ name: 'email_verification_token', nullable: true, type: 'bigint' })
  emailVerificationToken?: number;

  @Column({
    name: 'password_reset_token',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  passwordResetToken?: number;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  refreshToken?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  picture?: string;

  @Column({ type: 'boolean', default: false })
  deleted?: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone?: string;

  @Column({ type: 'text', name: 'fcm_device_token', nullable: true })
  fcmDeviceToken?: string;

  @OneToMany(() => EventFeed, (eventFeed) => eventFeed.user, { cascade: true })
  eventFeeds: EventFeed[];

  @OneToMany(() => UserService, (service) => service.user, { cascade: true })
  services: UserService[];

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  @JoinColumn({ name: 'walletId'})
  wallet: Wallet;

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  @JoinColumn({ name: 'cartId'})
  cart: Cart;
}
