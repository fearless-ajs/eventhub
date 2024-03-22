import { Test, TestingModule } from '@nestjs/testing';
import { UserEventListenerService } from './user-event-listener.service';

describe('UserEventListenerService', () => {
  let service: UserEventListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserEventListenerService],
    }).compile();

    service = module.get<UserEventListenerService>(UserEventListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
