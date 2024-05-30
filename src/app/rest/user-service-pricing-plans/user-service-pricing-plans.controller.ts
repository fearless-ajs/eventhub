import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserServicePricingPlansService } from './user-service-pricing-plans.service';
import { CreateUserServicePricingPlanDto } from './dto/create-user-service-pricing-plan.dto';
import { UpdateUserServicePricingPlanDto } from './dto/update-user-service-pricing-plan.dto';

@Controller('user-service-pricing-plans')
export class UserServicePricingPlansController {
  constructor(private readonly userServicePricingPlansService: UserServicePricingPlansService) {}

  // @Post()
  // create(@Body() createUserServicePricingPlanDto: CreateUserServicePricingPlanDto) {
  //   return this.userServicePricingPlansService.create(createUserServicePricingPlanDto);
  // }

  @Get()
  findAll() {
    return this.userServicePricingPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userServicePricingPlansService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserServicePricingPlanDto: UpdateUserServicePricingPlanDto) {
  //   return this.userServicePricingPlansService.update(+id, updateUserServicePricingPlanDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userServicePricingPlansService.remove(+id);
  }
}
