import { AbstractEntity } from '@libs/database/abstract.entity';
import { Column, Entity } from 'typeorm';

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
}
