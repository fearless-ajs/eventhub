import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletHistory } from '@app/rest/wallet-history/entities/wallet-history.entity';
import { Repository } from 'typeorm';
import { WalletService } from '@app/rest/wallet/wallet.service';
import { CreateWalletHistoryDto } from '@app/rest/wallet-history/dto/create-wallet-history.dto';
import { UsersService } from '@app/rest/users/users.service';
import ResponseSerializer from '@libs/helpers/ResponseSerializer';
import { Request } from 'express';

@Injectable()
export class WalletHistoryService {
  constructor(
    @InjectRepository(WalletHistory)
    private repo: Repository<WalletHistory>,
    private readonly walletService: WalletService,
    private readonly usersService: UsersService,
  ) {}

  async create(createWalletHistoryDto: CreateWalletHistoryDto): Promise<WalletHistory> {
    // De-structure createWalletHistoryDto data
    const { walletId, type, amount, description } = createWalletHistoryDto;

    // Find the wallet with the walletId
    const wallet = await this.walletService.findOne(walletId);
    // Check if the wallet was found
    if (!wallet)
      throw new NotFoundException('Wallet not found');

    // Create a walletHistory entity
    const walletHistory = this.repo.create({
      wallet,
      type,
      amount,
      description
    });
    // Save the walletHistory into the db
    return await this.repo.save(walletHistory);
  }

  async findAll(userId: number, req: Request): Promise<any> {
    const user = await this.usersService.findOne(userId);
    // Check if the user has a wallet
    if (!user.wallet)
      throw new NotFoundException('User does not have a wallet yet.');

    // Destructuring the wallet from the user
    const { wallet } = user;

    // Find all walletHistory with the walletId using query builder
    const queryBuilder =  this.repo.createQueryBuilder('walletHistory')
      .where('walletHistory.walletId = :walletId', { walletId: wallet.id })

    return ResponseSerializer.applyHTEAOS(req, queryBuilder);
  }

  async findOne(id: number, userId: number, throwError: boolean = true): Promise<WalletHistory> {
    // Find the user with the userId
    const user = await this.usersService.findOne(userId);
    // Check if the user has a wallet
    if (!user.wallet)
      throw new NotFoundException('User does not have a wallet yet.');

    // Destructuring the wallet from the user
    const { wallet } = user;

    // Find the walletHistory with the id and wallet id using query builder
    const walletHistory = await this.repo.createQueryBuilder('walletHistory')
      .where('walletHistory.id = :id', { id })
      .andWhere('walletHistory.walletId = :walletId', { walletId: wallet.id })
      .getOne();

    // Check if the walletHistory was found
    if (!walletHistory && throwError)
      throw new NotFoundException('Wallet History not found');

    // Return the walletHistory
    return walletHistory;
  }

  async remove(id: number, userId: number): Promise<WalletHistory> {
    // Find the walletHistory with the id
    const walletHistory = await this.findOne(id, userId);
    // Remove the walletHistory
    return await this.repo.remove(walletHistory);
  }
}
