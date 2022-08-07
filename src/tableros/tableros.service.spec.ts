import { Test, TestingModule } from '@nestjs/testing';
import { TablerosService } from './tableros.service';

describe('TablerosService', () => {
  let service: TablerosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TablerosService],
    }).compile();

    service = module.get<TablerosService>(TablerosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
