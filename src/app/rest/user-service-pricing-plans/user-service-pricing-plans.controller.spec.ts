import { Test, TestingModule } from '@nestjs/testing';
import { UserServicePricingPlansController } from './user-service-pricing-plans.controller';
import { UserServicePricingPlansService } from './user-service-pricing-plans.service';

describe('UserServicePricingPlansController', () => {
  let controller: UserServicePricingPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserServicePricingPlansController],
      providers: [UserServicePricingPlansService],
    }).compile();

    controller = module.get<UserServicePricingPlansController>(UserServicePricingPlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
