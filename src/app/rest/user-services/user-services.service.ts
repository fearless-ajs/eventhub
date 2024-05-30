import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserServiceDto } from './dto/create-user-service.dto';
import { UpdateUserServiceDto } from './dto/update-user-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from './entities/user-service.entity';
import { EntityManager, Repository } from 'typeorm';
import { FileSystemService } from '@libs/services/file-system/file-system.service';
import { UsersService } from '../users/users.service';
import { UserServicePricingPlan } from '../user-service-pricing-plans/entities/user-service-pricing-plan.entity';
import { UserServiceImage } from '../user-service-images/entities/user-service-image.entity';

@Injectable()
export class UserServicesService {
  constructor(
    @InjectRepository(UserService) private readonly repo: Repository<UserService>,
    @InjectRepository(UserServicePricingPlan) private readonly pricingPlanRepo: Repository<UserServicePricingPlan>,
    @InjectRepository(UserServiceImage) private readonly imageRepo: Repository<UserServiceImage>,
    private readonly fileSystemService: FileSystemService,
    private readonly usersService: UsersService,
    private readonly entityManager: EntityManager
  ) {}


  async create(createUserServiceDto: CreateUserServiceDto, userId: number) {
    const { name, description, category, pricePlans, images } = createUserServiceDto;

    // Check if price plans is supplied
    if (!pricePlans || !pricePlans.length) {
      throw new UnprocessableEntityException('Price plans are required');
    }

    // Check if images is supplied too
    if (!images || !images.length) {
      throw new UnprocessableEntityException('Images are required');
    }

    // Validate price plans
    for (const pricePlan of pricePlans) {
        if (!pricePlan.item || !pricePlan.amount) {
          throw new UnprocessableEntityException('Price plans must have a name and amount');
        }

        // Check if amount is a positive number
        if (isNaN(pricePlan.amount) || pricePlan.amount <= 0) {
          throw new UnprocessableEntityException('Price plan amount must be a positive number');
        }  
    }

    const savedService = await this.entityManager.transaction(async (entityManager) => {
        // Fetch the current user data
        const user = await this.usersService.findOne(userId);

        // Create a new user service
        const service = entityManager.create(UserService, {
          name,
          description,
          category,
          user
        });

      const savedService =  await entityManager.save(UserService, service);

        // Create price plans and attach them to the user service
        for (const pricePlan of pricePlans) {
          const pricingPlan = entityManager.create(UserServicePricingPlan, {
            item: pricePlan.item,
            amount: pricePlan.amount,
            service: savedService
          });

          await entityManager.save(UserServicePricingPlan, pricingPlan);
        }

        // Create images and attach them to the user service
        for (const image of images) {
          const imageUrl = await this.fileSystemService.uploadFileToAWS(image);

          const imageEntity = entityManager.create(UserServiceImage, {
            url: imageUrl as unknown as string,
            service: savedService
          });

          await entityManager.save(UserServiceImage, imageEntity);
        }

        return savedService;
    });

    return this.findOne(savedService.id, false);
  }

  findAll() {
    return this.repo
    .createQueryBuilder('services')
    .leftJoinAndSelect('services.user', 'user')
    .leftJoinAndSelect('services.images', 'images')
    .leftJoinAndSelect('services.pricingPlans', 'pricingPlans')
  }

  async findOne(id: number, throwError = true) {
    const service = await this.repo
    .createQueryBuilder('service')
    .leftJoinAndSelect('service.user', 'user')
    .leftJoinAndSelect('service.images', 'images')
    .leftJoinAndSelect('service.pricingPlans', 'pricingPlans')
    .where('service.id = :id', { id: id })
    .getOne();

    if (!service && throwError)
      throw new UnprocessableEntityException(`Service with ID ${id} not found`);

    return service;
  }

  async update(id: number, updateUserServiceDto: UpdateUserServiceDto, userId: number) {
    const { name, description, category, pricePlans } = updateUserServiceDto;

    // Find current user
    // const user = await this.usersService.findOne(userId);
    
    // Find the user service
    const service = await this.findOne(id);

    // Check if the user owns the service
    if (service.user.id !== userId) {
      throw new UnprocessableEntityException('Current user does not own this service');
    }

    // check if price plans is supplied
    if(pricePlans && pricePlans.length) {
      for (const pricePlan of pricePlans) {
        if (!pricePlan.item || !pricePlan.amount) {
          throw new UnprocessableEntityException('Price plans must have a name and amount');
        }

        // Check if amount is a positive number
        if (isNaN(pricePlan.amount) || pricePlan.amount <= 0) {
          throw new UnprocessableEntityException('Price plan amount must be a positive number');
        }  
      }
    }

    const updatedService = await this.entityManager.transaction(async (entityManager: EntityManager) => {
     // Step 1: Find the user service from the db
      const service = await this.repo.createQueryBuilder('service')
      .where('service.id = :id', { id: id })
      .getOne();
     
      // Step 2: Modify the entity with new data
     Object.assign(service, { name, description, category });

      // Update price plans
      if (pricePlans && pricePlans.length) {
        for (const pricePlan of pricePlans) {
          // Check if amount is a positive number
          if (isNaN(pricePlan.amount) || pricePlan.amount <= 0) {
            throw new UnprocessableEntityException('Price plan amount must be a positive number');
          }  
        }

       const existingPricingPlans = await entityManager.createQueryBuilder(UserServicePricingPlan, 'pricingPlan')
                  .leftJoinAndSelect('pricingPlan.service', 'service')           
                  .where('service.id = :id', { id })
                  .getMany()

        // Delete all existing price plans
        for (const pricePlan of existingPricingPlans) {
          const entity = await entityManager.createQueryBuilder<UserServicePricingPlan>(UserServicePricingPlan, 'pricingPlan')
                  .leftJoinAndSelect('pricingPlan.service', 'service')           
                  .where('service.id = :serviceId', { serviceId: id })
                  .andWhere('pricingPlan.id = :pricePlanId', { pricePlanId: pricePlan.id })
                  .getOne();

          await entityManager.remove(UserServicePricingPlan, entity);
        }
        //await entityManager.delete(UserServicePricingPlan, { service: service });

        for (const pricePlan of pricePlans) {
          
          const pricingPlan = entityManager.create(UserServicePricingPlan, {
            item: pricePlan.item,
            amount: pricePlan.amount,
            service: service
          });

          await entityManager.save(UserServicePricingPlan, pricingPlan);
        }
      }

      // Check if images is supplied
      if (updateUserServiceDto.images && updateUserServiceDto.images.length) {
        // Delete all existing images
        await entityManager.delete(UserServiceImage, { service: service });

        for (const image of updateUserServiceDto.images) {
          const imageUrl = await this.fileSystemService.uploadFileToAWS(image);

          const imageEntity = entityManager.create(UserServiceImage, {
            url: imageUrl as unknown as string,
            service: service
          });

          await entityManager.save(UserServiceImage, imageEntity);
        }
      }

      return entityManager.save(UserService, service);
    });

    return this.findOne(updatedService.id, false);
  }

  async remove(id: number, userId: number) {
    
    // Find the user service
    const service = await this.repo.createQueryBuilder('service')
    .leftJoinAndSelect('service.user', 'user')
    .where('service.id = :id', { id: id })
    .getOne();

    if(!service)
      throw new NotFoundException(`Service with ID ${id} not found`);

    // Check if the user owns the service
    if (service.user.id !== userId) {
      throw new UnauthorizedException('Current user does not own this service');
    }

    await this.entityManager.transaction(async (entityManager: EntityManager) => {
      // Delete all price plans
      await entityManager.delete(UserServicePricingPlan, { service });

      const images = await entityManager.createQueryBuilder(UserServiceImage, 'images')
                  .leftJoinAndSelect('images.service', 'service')           
                  .where('service.id = :id', { id })
                  .getMany()

      // Delete all images from cloudinary
      for (const image of images) {
        await this.fileSystemService.deleteFileFromAWS(image.url);
      }

      // Delete all images
      await entityManager.delete(UserServiceImage, { service });

      // Delete the service
      await entityManager.delete(UserService, id);
    });

    return true;
  }
}
