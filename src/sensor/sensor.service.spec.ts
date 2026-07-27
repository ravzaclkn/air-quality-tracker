import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorService } from './sensor.service';
import { SensorReading } from './sensor-reading.entity';
import { SensorGateway } from '../sensor.gateway';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock Repository oluşturuyoruz ki gerçek veritabanına bağlanmasın
const mockSensorRepository: any = {
  create: jest.fn().mockImplementation((dto) => dto),
save: jest.fn().mockImplementation((sensor: any) => Promise.resolve({ id: 1, ...sensor })),  find: jest.fn().mockImplementation(() => 
    Promise.resolve([
      { id: 1, pm1_0: 10, pm2_5: 20, pm4_0: 30, pm10: 40, timestamp: new Date() }
    ])
  ),
  clear: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
};
// Mock Gateway oluşturuyoruz
const mockSensorGateway = {
  sendSensorData: jest.fn(),
};

describe('SensorService', () => {
  let service: SensorService;
  let repository: Repository<SensorReading>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorService,
        {
          provide: getRepositoryToken(SensorReading),
          useValue: mockSensorRepository,
        },
        {
          provide: SensorGateway,
          useValue: mockSensorGateway,
        },
      ],
    }).compile();

    service = module.get<SensorService>(SensorService);
    repository = module.get<Repository<SensorReading>>(getRepositoryToken(SensorReading));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveReading', () => {
    it('should successfully save a sensor reading and trigger websocket gateway', async () => {
      const inputData = {
        timestamp: new Date().toISOString(),
        metrics: {
          pm1_0: 12.5,
          pm2_5: 22.1,
          pm4_0: 32.4,
          pm10: 45.0,
        },
      };

      const result = await service.saveReading(inputData);

      // Veritabanı create ve save fonksiyonlarının çağrıldığını doğruluyoruz
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();

      // WebSocket gateway'in tetiklendiğini doğruluyoruz
      expect(mockSensorGateway.sendSensorData).toHaveBeenCalled();

      // Sonucun doğru dönüp dönmediğini kontrol ediyoruz
      expect(result).toHaveProperty('pm2_5', 22.1);
    });
  });

  describe('getAllReadings', () => {
    it('should return an array of sensor readings', async () => {
      const readings = await service.getAllReadings();
      expect(readings).toHaveLength(1);
      expect(readings[0].pm1_0).toEqual(10);
    });
  });
});