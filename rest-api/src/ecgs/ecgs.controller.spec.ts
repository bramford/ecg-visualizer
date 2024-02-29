import { Test, TestingModule } from '@nestjs/testing';
import { EcgsController } from './ecgs.controller';
import { EcgsService } from './ecgs.service';

describe('EcgsController', () => {
  let controller: EcgsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EcgsController],
      providers: [EcgsService],
    }).compile();

    controller = module.get<EcgsController>(EcgsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
