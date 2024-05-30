import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '@app/rest/wallet/entities/wallet.entity';
import { UsersModule } from '@app/rest/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    UsersModule
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
