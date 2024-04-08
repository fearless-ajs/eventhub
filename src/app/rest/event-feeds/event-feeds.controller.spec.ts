import { Test, TestingModule } from '@nestjs/testing';
import { EventFeedsController } from './event-feeds.controller';
import { EventFeedsService } from './event-feeds.service';

describe('EventFeedsController', () => {
  let controller: EventFeedsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventFeedsController],
      providers: [EventFeedsService],
    }).compile();

    controller = module.get<EventFeedsController>(EventFeedsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
