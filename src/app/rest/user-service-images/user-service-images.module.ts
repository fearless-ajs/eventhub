import { Module } from '@nestjs/common';
import { UserServiceImagesService } from './user-service-images.service';
import { UserServiceImagesController } from './user-service-images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserServiceImage } from './entities/user-service-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserServiceImage]),
  ],
  controllers: [UserServiceImagesController],
  providers: [UserServiceImagesService],
})
export class UserServiceImagesModule {}
