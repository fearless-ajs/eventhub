import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceImagesController } from './user-service-images.controller';
import { UserServiceImagesService } from './user-service-images.service';

describe('UserServiceImagesController', () => {
  let controller: UserServiceImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserServiceImagesController],
      providers: [UserServiceImagesService],
    }).compile();

    controller = module.get<UserServiceImagesController>(UserServiceImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
