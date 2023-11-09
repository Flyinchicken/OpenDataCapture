import { afterAll, beforeAll, describe, expect, it } from 'bun:test';

import { HttpStatus } from '@nestjs/common';
import { type NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';

let app: NestExpressApplication;
let server: unknown;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule]
  }).compile();

  app = moduleRef.createNestApplication({
    logger: ['debug', 'error', 'fatal', 'log', 'verbose', 'warn']
  });

  await app.init();
  server = app.getHttpServer();
});

describe('App', () => {
  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});

describe('/assignments', () => {
  describe('GET /assignments', () => {
    it('should return status code 200', async () => {
      const response = await request(server).get('/assignments');
      expect(response.status).toBe(HttpStatus.OK);
    });
  });
});

afterAll(async () => {
  await app.close();
});
