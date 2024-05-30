import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from '@libs/database/abstract.entity';
import { User } from '@app/rest/users/entities/user.entity';
import { WalletHistory } from '@app/rest/wallet-history/entities/wallet-history.entity';

@Entity({ name: 'wallets' })
export class Wallet extends AbstractEntity<Wallet>{
  @Column({ name: 'balance', type: 'decimal', precision: 10, scale: 2})
  balance: number;

  @OneToOne(() => User, (user) => user.wallet)
  user: User;

  @OneToMany(() => WalletHistory, (history) => history.wallet, { cascade: true })
  histories: WalletHistory[];
}
