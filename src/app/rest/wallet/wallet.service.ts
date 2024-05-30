import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '@app/rest/wallet/entities/wallet.entity';
import { UsersService } from '@app/rest/users/users.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private repo: Repository<Wallet>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number): Promise<Wallet> {
    // Find the user with the userId
    const user = await this.usersService.findOne(userId);
    // check if the user already has a wallet
    if (user.wallet)
      throw new NotAcceptableException('User already has a wallet');

    // Create a wallet for the user
    const wallet = this.repo.create({
      balance: 0,
      user
    });

    // save the wallet into the db
    return await this.repo.save(wallet);
  }

  async findOne(id: number, throwError: boolean = true): Promise<Wallet> {
    // Find the wallet with the id
    const wallet = await this.repo.findOneBy({ id });

    // Check if the wallet was found
    if (!wallet && throwError)
      throw new NotFoundException('Wallet not found');

    // Return the wallet
    return wallet;
  }

  async findUserWallet(userId: number, throwError: boolean = true): Promise<Wallet> {
    // Find the user with the userId
    const user = await this.usersService.findOne(userId);
    // Check if the user has a wallet
    if (!user.wallet && throwError)
      throw new NotFoundException('Wallet not found');

    // Return the wallet
    return user.wallet;
  }

  async update(userId: number, updateWalletDto: UpdateWalletDto) {
    const wallet = await this.findUserWallet(userId);
    // Update the wallet balance
    wallet.balance = updateWalletDto.balance;
    // Save the wallet
    return await this.repo.save(wallet);
  }
}
