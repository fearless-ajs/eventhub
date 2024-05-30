import { Module } from '@nestjs/common';
import { WalletHistoryService } from './wallet-history.service';
import { WalletHistoryController } from './wallet-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletHistory } from '@app/rest/wallet-history/entities/wallet-history.entity';
import { WalletModule } from '@app/rest/wallet/wallet.module';
import { UsersModule } from '@app/rest/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletHistory]),
    WalletModule,
    UsersModule
  ],
  controllers: [WalletHistoryController],
  providers: [WalletHistoryService],
  exports: [WalletHistoryService],
})
export class WalletHistoryModule {}
