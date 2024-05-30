import { Controller, Get, Param, Delete, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { WalletHistoryService } from './wallet-history.service';
import JwtAuthGuard from '@libs/Guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '@libs/decorators/current-user.decorator';
import { TJwtPayload } from '@libs/types';
import { Request } from 'express';
import ResponseSerializer from '@libs/helpers/ResponseSerializer';

@Controller('wallet-history')
export class WalletHistoryController {
  constructor(private readonly walletHistoryService: WalletHistoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser() user: TJwtPayload,
    @Req() req: Request
  ){
    return this.walletHistoryService.findAll(user.userId, req);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id') id: number,
    @CurrentUser() user: TJwtPayload
  ) {
    const response_data = await this.walletHistoryService.findOne(id, user.userId);
    return ResponseSerializer.data(response_data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: TJwtPayload
  ) {
    await this.walletHistoryService.remove(id, user.userId);
    return ResponseSerializer.message('Wallet history deleted successfully');
  }
}
