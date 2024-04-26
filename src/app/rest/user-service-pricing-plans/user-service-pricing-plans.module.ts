import { Module } from '@nestjs/common';
import { UserServicePricingPlansService } from './user-service-pricing-plans.service';
import { UserServicePricingPlansController } from './user-service-pricing-plans.controller';
import { UserServicePricingPlan } from './entities/user-service-pricing-plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserServicePricingPlan]),
  ],
  controllers: [UserServicePricingPlansController],
  providers: [UserServicePricingPlansService],
})
export class UserServicePricingPlansModule {}
