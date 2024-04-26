import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceImagesService } from './user-service-images.service';

describe('UserServiceImagesService', () => {
  let service: UserServiceImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserServiceImagesService],
    }).compile();

    service = module.get<UserServiceImagesService>(UserServiceImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
