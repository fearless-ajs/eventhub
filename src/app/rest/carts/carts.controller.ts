import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import JwtAuthGuard from '@libs/Guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '@libs/decorators/current-user.decorator';
import { TJwtPayload } from '@libs/types';
import ResponseSerializer from '@libs/helpers/ResponseSerializer';
import { AddItemToCartDto } from '@app/rest/carts/dto/add -item-to-cart.dto';
import { RemoveCartItemDto } from '@app/rest/carts/dto/remove -cart-item.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post('add-item')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async addItem(
    @Body() addItemToCartDto: AddItemToCartDto,
    @CurrentUser() user: TJwtPayload,
  ) {
    const response = await this.cartsService.addCartItem(addItemToCartDto, user.userId);
    return ResponseSerializer.data(response);
  }

  @Post('reduce-item')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async reduceItem(
    @Body() removeCartItem: RemoveCartItemDto,
    @CurrentUser() user: TJwtPayload,
  ) {
    const response = await this.cartsService.subtractCartItemQuantity(removeCartItem, user.userId);
    // Check if the response is a boolean(in case the quantity was 1)
    if (typeof response === 'boolean')
      return ResponseSerializer.message('Item removed from cart')
    // Return the reduced item quantity
    return ResponseSerializer.data(response);
  }

  @Post('remove-item')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async removeItem(
    @Body() removeCartItem: RemoveCartItemDto,
    @CurrentUser() user: TJwtPayload,
  ) {
    await this.cartsService.removeCartItem(removeCartItem, user.userId);
    return ResponseSerializer.message('Item removed from cart')
  }

  @Get('mine')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findOne(
    @CurrentUser() user: TJwtPayload,
  ) {
    const response_data = await this.cartsService.findUserCart(user.userId);
    return ResponseSerializer.data(response_data);
  }

  @Post('clear')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async clearCart(
    @CurrentUser() user: TJwtPayload,
  ) {
    await this.cartsService.clearCart(user.userId);
    return ResponseSerializer.message('Cart cleared.')
  }

}
