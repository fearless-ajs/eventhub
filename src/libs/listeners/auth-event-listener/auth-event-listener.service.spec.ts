import { Test, TestingModule } from '@nestjs/testing';
import { AuthEventListenerService } from './auth-event-listener.service';

describe('AuthEventListenerService', () => {
  let service: AuthEventListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthEventListenerService],
    }).compile();

    service = module.get<AuthEventListenerService>(AuthEventListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
