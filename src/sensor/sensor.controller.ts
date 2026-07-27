import { Controller, Get, Logger } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('sensor')
export class SensorController {
  private readonly logger = new Logger(SensorController.name);

  constructor(private readonly sensorService: SensorService) {}

  @Get('status')
  getStatus() {
    return this.sensorService.getSensorStatus();
  }

  @EventPattern('sensors/ipm/data')
  handleSensorData(@Payload() data: any) {
    this.logger.log(`Received sensor data: ${JSON.stringify(data)}`);
    // Burada gelen veriyi işleyebilir veya başka bir servise iletebilirsiniz.
  }
}