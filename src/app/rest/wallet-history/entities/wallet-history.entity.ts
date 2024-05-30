import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@libs/database/abstract.entity';
import { Wallet } from '@app/rest/wallet/entities/wallet.entity';

@Entity({ name: 'wallet_histories' })
export class WalletHistory extends AbstractEntity<WalletHistory> {
  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'type', type: 'varchar', length: 255 })
  type: string; // Deposit or Withdraw

  @Column({ name: 'description', type: 'text' })
  description: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.histories)
  wallet: Wallet;

}
