import { Test, TestingModule } from '@nestjs/testing';
import { EmailEngineService } from './email-engine.service';

describe('EmailEngineService', () => {
  let service: EmailEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailEngineService],
    }).compile();

    service = module.get<EmailEngineService>(EmailEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
