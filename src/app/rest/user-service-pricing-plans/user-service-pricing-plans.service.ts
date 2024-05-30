import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserServicePricingPlanDto } from './dto/create-user-service-pricing-plan.dto';
import { UpdateUserServicePricingPlanDto } from './dto/update-user-service-pricing-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserServicePricingPlan } from '@app/rest/user-service-pricing-plans/entities/user-service-pricing-plan.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserServicePricingPlansService {
  constructor(
    @InjectRepository(UserServicePricingPlan)
    private repo: Repository<UserServicePricingPlan>,
    private readonly entityManager: EntityManager,
    // private readonly usersService: UsersService,
    // private readonly pricingPlanService: UserServicePricingPlansService,
  ) {}

  async create(createUserServicePricingPlanDto: CreateUserServicePricingPlanDto, cartId: number) {
    // //Destrcuture createUserServicePricingPlanDto data
    // const { pricingPlanId, quantity} = createUserServicePricingPlanDto;
    //
    // // find the cart using entity Manager
    // const cart = await this.entityManager.findOneBy('Cart', { id: cartId });
    // // Check if the cart exists
    // if (!cart)
    //   throw new NotFoundException('Cart not found');
    //
    // // Find pricing plan using entity Manager
    // const pricingPlan = await this.entityManager.findOneBy('UserServicePricingPlan', { id: pricingPlanId });
    // // Check if the pricing plan exists
    // if (!pricingPlan)
    //   throw new NotFoundException('Pricing plan not found');

    // Create a userServicePricingPlan entity
    // const userServicePricingPlan = this.repo.create({
    //   cart,
    //   pricingPlan,
    //   quantity
    // });
  }

  findAll() {
    return `This action returns all userServicePricingPlans`;
  }

  async findOne(id: number) {
    return this.repo.findOneBy({ id });
  }
x
  // update(id: number, updateUserServicePricingPlanDto: UpdateUserServicePricingPlanDto) {
  //   return `This action updates a #${id} userServicePricingPlan`;
  // }

  remove(id: number) {
    return `This action removes a #${id} userServicePricingPlan`;
  }
}
