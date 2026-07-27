import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SensorModule } from './sensor/sensor.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // SensorModule'ün ConfigService'i görebilmesi için şart
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      autoLoadEntities: true,   // Entity'lerin otomatik olarak yüklenmesini taninmasini saglar
      synchronize: true,         // Geliştirme ortamında veritabanı şemasını otomatik olarak senkronize eder
    }),     
    SensorModule,
  ],
})
export class AppModule {}