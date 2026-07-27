import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { AppModule } from './../src/app.module';

describe('SensorController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/sensor/readings (GET) - tüm okumaları listelemeli', async () => {
    const res = await request(app.getHttpServer()).get('/sensor/readings');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/sensor/status (GET) - sensör durumunu döndürmeli', async () => {
    const res = await request(app.getHttpServer()).get('/sensor/status');

    expect(res.status).toBe(200);
  });

  it('/sensor/latest (GET) - en son okumayı döndürmeli', async () => {
    const res = await request(app.getHttpServer()).get('/sensor/latest');

    expect(res.status).toBe(200);
  });

  it('/sensor/history (GET) - from/to parametreleriyle geçmiş veri döndürmeli', async () => {
    const res = await request(app.getHttpServer())
      .get('/sensor/history')
      .query({ from: '2024-01-01', to: '2024-12-31' });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/sensor/clear (DELETE) - tüm veriyi temizlemeli', async () => {
    const res = await request(app.getHttpServer()).delete('/sensor/clear');

    expect(res.status).toBe(200);
  });
});