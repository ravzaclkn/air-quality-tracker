import {IsDateString, IsNotEmpty } from 'class-validator';

export class HistoryQueryDto {
    @IsNotEmpty()
    @IsDateString()
    from!: string;

    @IsNotEmpty()
    @IsDateString()
    to!: string;
}