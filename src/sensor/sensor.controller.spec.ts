import { Test, TestingModule } from '@nestjs/testing';
import { SensorController } from './sensor.controller';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SensorService } from './sensor.service';

describe('SensorController', () => {
  let controller: SensorController;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [SensorController],
 providers: [
  {
    provide: SensorService,
    useValue: {
      getAllReadings: jest.fn<() => Promise<any[]>>().mockResolvedValue([]),
      saveReading: jest.fn<() => Promise<any>>().mockResolvedValue({}),
    },
  },
],
  }).compile();

  controller = module.get<SensorController>(SensorController);
});

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
