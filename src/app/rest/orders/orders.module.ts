import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@app/rest/orders/entities/order.entity';
import { UsersModule } from '@app/rest/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UsersModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
