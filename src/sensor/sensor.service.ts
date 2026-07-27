import { Injectable,Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorReading } from './sensor-reading.entity';

@Injectable()
export class SensorService {
  private readonly logger = new Logger(SensorService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(SensorReading)
    private readonly sensorReadingRepository: Repository<SensorReading>,  
  ) {}

  getSensorStatus() {
    return {
      brokerUrl: this.configService.get<string>('MQTT_BROKER_URL'),
      topic: this.configService.get<string>('MQTT_TOPIC'),
      status: 'active',
    };
  }

async saveReading(payload: any) {
    if (!payload) return;

    this.logger.log(`Sensör verisi kaydediliyor: ${JSON.stringify(payload)}`);

    const reading = this.sensorReadingRepository.create({
      pm1_0: payload.pm1_0,
      pm2_5: payload.pm2_5,
      pm4_0: payload.pm4_0,
      pm10: payload.pm10,
    });

    return await this.sensorReadingRepository.save(reading);
  }