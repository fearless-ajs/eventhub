import { PartialType } from '@nestjs/mapped-types';
import { CreateUserServicePricingPlanDto } from './create-user-service-pricing-plan.dto';

export class UpdateUserServicePricingPlanDto extends PartialType(CreateUserServicePricingPlanDto) {}
