import { Test, TestingModule } from '@nestjs/testing';
import { TablerosController } from './tableros.controller';
import { TablerosService } from './tableros.service';

describe('TablerosController', () => {
  let controller: TablerosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TablerosController],
      providers: [TablerosService],
    }).compile();

    controller = module.get<TablerosController>(TablerosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
