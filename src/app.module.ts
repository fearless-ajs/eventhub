import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig, AppConfig } from '@config/index';
import { TypeOrmModule } from '@nestjs/typeorm';
// import * as redisStore from 'cache-manager-redis-store';
// import { CacheModule } from '@nestjs/cache-manager';
import { MulterModule } from '@nestjs/platform-express';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsListenerModule } from '@libs/listeners/events-listener/events-listener.module';
import { UsersModule } from '@app/rest/users/users.module';
import { AuthModule } from '@app/rest/auth/auth.module';
import { EventFeedsModule } from '@app/rest/event-feeds/event-feeds.module';
import { UserServicesModule } from '@app/rest/user-services/user-services.module';
import { UserServicePricingPlansModule } from '@app/rest/user-service-pricing-plans/user-service-pricing-plans.module';
import { UserServiceImagesModule } from '@app/rest/user-service-images/user-service-images.module';
import { WalletModule } from '@app/rest/wallet/wallet.module';
import { WalletHistoryModule } from '@app/rest/wallet-history/wallet-history.module';
import { CartsModule } from '@app/rest/carts/carts.module';
import { CartItemsModule } from '@app/rest/cart-items/cart-items.module';
import { OrdersModule } from '@app/rest/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    // CacheModule.register({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: process.env.REDIS_HOST,
    //   port: process.env.REDIS_PORT,
    // }),
    MulterModule.register(),
    EventEmitterModule.forRoot(),
    EventsListenerModule,
    UsersModule,
    AuthModule,
    EventFeedsModule,
    UserServicesModule,
    UserServicePricingPlansModule,
    UserServiceImagesModule,
    WalletModule,
    WalletHistoryModule,
    CartsModule,
    CartItemsModule,
    OrdersModule
  ],
})
export class AppModule {}
