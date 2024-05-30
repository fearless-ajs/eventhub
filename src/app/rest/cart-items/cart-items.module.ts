import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from '@app/rest/cart-items/entities/cart-item.entity';
import { UserServicePricingPlansModule } from '@app/rest/user-service-pricing-plans/user-service-pricing-plans.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem]),
    UserServicePricingPlansModule
  ],
  controllers: [CartItemsController],
  providers: [CartItemsService],
  exports: [CartItemsService]
})
export class CartItemsModule {}
