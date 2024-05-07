import { Test, TestingModule } from '@nestjs/testing';
import { CircleController } from './circle.controller';

describe('CircleController', () => {
  let controller: CircleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CircleController],
    }).compile();

    controller = module.get<CircleController>(CircleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
