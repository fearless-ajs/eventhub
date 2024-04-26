import { Test, TestingModule } from '@nestjs/testing';
import { UserServicePricingPlansService } from './user-service-pricing-plans.service';

describe('UserServicePricingPlansService', () => {
  let service: UserServicePricingPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserServicePricingPlansService],
    }).compile();

    service = module.get<UserServicePricingPlansService>(UserServicePricingPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
