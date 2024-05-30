import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '@app/rest/carts/entities/cart.entity';
import { UsersModule } from '@app/rest/users/users.module';
import { CartItemsModule } from '@app/rest/cart-items/cart-items.module';
import { UserServicePricingPlansModule } from '@app/rest/user-service-pricing-plans/user-service-pricing-plans.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    UsersModule,
    CartItemsModule,
    UserServicePricingPlansModule
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService]
})
export class CartsModule {}
