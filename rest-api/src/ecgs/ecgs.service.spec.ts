import { Test, TestingModule } from '@nestjs/testing';
import { EcgsService } from './ecgs.service';

describe('EcgsService', () => {
  let service: EcgsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EcgsService],
    }).compile();

    service = module.get<EcgsService>(EcgsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
