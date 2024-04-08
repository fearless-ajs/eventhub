import { Test, TestingModule } from '@nestjs/testing';
import { EventFeedsService } from './event-feeds.service';

describe('EventFeedsService', () => {
  let service: EventFeedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventFeedsService],
    }).compile();

    service = module.get<EventFeedsService>(EventFeedsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
