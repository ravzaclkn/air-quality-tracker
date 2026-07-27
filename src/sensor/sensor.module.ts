import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorReading } from './sensor-reading.entity';
import { SensorGateway } from '../sensor.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([SensorReading])],
  controllers: [SensorController],
  providers: [SensorService, SensorGateway],
})
export class SensorModule {}
