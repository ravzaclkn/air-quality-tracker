import { Controller, Get, Delete, Logger, Query } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { HistoryQueryDto } from './dto/query.dto';

@Controller('sensor')
export class SensorController {
  private readonly logger = new Logger(SensorController.name);

  constructor(private readonly sensorService: SensorService) {}

  @Get('status')
  getStatus() {
    return this.sensorService.getSensorStatus();
  }

  @Get('readings')
  async getAllReadings() {
    return await this.sensorService.getAllReadings();
  }


  @Get('latest')
  async getLatestReading() {
    return await this.sensorService.getLatestReading();
  }
  
  @Get('history')
  async getHistory(@Query() query: HistoryQueryDto) {
    return await this.sensorService.getHistoryReadings(query.from, query.to);
  }

  @Delete('clear')
  async clearSensorData() {
    return await this.sensorService.clearAllData();
  }

  @EventPattern('sensors/ipm/data')
  async handleSensorData(@Payload() data: any) {
    this.logger.log(`Received sensor data: ${JSON.stringify(data)}`);
    await this.sensorService.saveReading(data);
  }
}