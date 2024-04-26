import { Module } from '@nestjs/common';
import { UserServicesService } from './user-services.service';
import { UserServicesController } from './user-services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './entities/user-service.entity';
import { FileSystemService } from '@libs/services/file-system/file-system.service';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { UserServiceImage } from '../user-service-images/entities/user-service-image.entity';
import { UserServicePricingPlan } from '../user-service-pricing-plans/entities/user-service-pricing-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserService, UserServiceImage, UserServicePricingPlan]),
    UsersModule
  ],
  controllers: [UserServicesController],
  providers: [UserServicesService, FileSystemService],
})
export class UserServicesModule {}
