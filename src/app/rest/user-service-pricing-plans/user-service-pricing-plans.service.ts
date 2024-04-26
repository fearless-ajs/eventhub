import { Injectable } from '@nestjs/common';
import { CreateUserServicePricingPlanDto } from './dto/create-user-service-pricing-plan.dto';
import { UpdateUserServicePricingPlanDto } from './dto/update-user-service-pricing-plan.dto';

@Injectable()
export class UserServicePricingPlansService {
  create(createUserServicePricingPlanDto: CreateUserServicePricingPlanDto, ) {
    return 'This action adds a new userServicePricingPlan';
  }

  findAll() {
    return `This action returns all userServicePricingPlans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userServicePricingPlan`;
  }
x
  update(id: number, updateUserServicePricingPlanDto: UpdateUserServicePricingPlanDto) {
    return `This action updates a #${id} userServicePricingPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} userServicePricingPlan`;
  }
}
