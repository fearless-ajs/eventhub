import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import JwtAuthGuard from '@libs/Guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '@libs/decorators/current-user.decorator';
import { TJwtPayload } from '@libs/types';
import ResponseSerializer from '@libs/helpers/ResponseSerializer';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('fund')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async fund(@CurrentUser() user: TJwtPayload) {

  }

  @Post('withdraw')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async withdraw(@CurrentUser() user: TJwtPayload) {

  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findOne(@CurrentUser() user: TJwtPayload) {
    const response_data = await this.walletService.findOne(user.userId);
    return ResponseSerializer.data(response_data);
  }

}
