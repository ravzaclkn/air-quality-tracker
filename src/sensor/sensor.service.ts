import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { SensorReading } from './sensor-reading.entity';

@Injectable()
export class SensorService {
  private readonly logger = new Logger(SensorService.name);

  constructor(
    @InjectRepository(SensorReading)
    private readonly sensorReadingRepository: Repository<SensorReading>,
  ) {}

  getSensorStatus() {
    return { status: 'active', timestamp: new Date().toISOString() };
  }

  async getAllReadings(): Promise<SensorReading[]> {
    return await this.sensorReadingRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  async saveReading(data: any) {
    this.logger.log(`Sensör verisi kaydediliyor: ${JSON.stringify(data)}`);
    
    // Entity'deki alanlarla birebir eşleşen yapı (deviceId kaldırıldı)
    const reading = this.sensorReadingRepository.create({
      timestamp: data.timestamp,
      pm1_0: data.metrics?.pm1_0,
      pm2_5: data.metrics?.pm2_5,
      pm4_0: data.metrics?.pm4_0,
      pm10: data.metrics?.pm10,
    });

    return await this.sensorReadingRepository.save(reading);
  }

  async getLatestReading(): Promise<SensorReading | null> {
    const readings =await this.sensorReadingRepository.find({
      order: { timestamp: 'DESC' },
      take: 1,
    });
    return readings.length > 0 ? readings[0] : null;
  }
  async getHistoryReadings(from: string, to: string): Promise<SensorReading[]> {
    return await this.sensorReadingRepository.find({
      where: {
        timestamp: Between(new Date(from), new Date(to)),
      },
      order: { timestamp: 'ASC' },
    });
  }
  
  async clearAllData() {
    await this.sensorReadingRepository.clear();
    return { message: 'Tüm sensör verileri temizlendi.' };
  }

  
}