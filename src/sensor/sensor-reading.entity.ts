import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity('sensor_readings')
export class SensorReading {
  @PrimaryGeneratedColumn()
id: number;

@Column('float')
pm1_0: number;

@Column('float')
pm2_5: number;

@Column('float')
pm4_0: number;

@Column('float')
pm10: number;


@CreateDateColumn()
CreatedAt: Date;

@UpdateDateColumn()
UpdatedAt: Date;
}