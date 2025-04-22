import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from '../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let appService: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appService = app.get<AppService>(AppService);
    server = app.getHttpServer();
    await app.init();
  });

  describe(`/ GET`, () => {
    it(`devrait retouner 403 si une cle api non valide`, () => {
      return request(server).get('/').set(`x-api-key`, `INVALID`).expect(403);
    });

    it(`devrait retouner 403 si aucune cle api est presente`, () => {
      return request(server).get('/').expect(403);
    });

    it(`devrait retouner un emoji aleatoirement`, () => {
      const emojis = appService.getEmojis();

      return request(server)
        .get('/')
        .set(`x-api-key`, `secret`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.data).toHaveProperty('emoji');
          expect(body.data).toHaveProperty('browser');
          expect(body.data.browser).toBe(`Unknown`);
          expect(emojis).toContain(body.data.emoji);
        });
    });

    it(`devrait renvoyer l'agent utilisateur`, () => {
      const emojis = appService.getEmojis();
      return request(server)
        .get('/')
        .set(`x-api-key`, `secret`)
        .set(`User-Agent`, `Thunder Client (https://www.thunderclient.com)`)
        .expect(200)
        .expect(({ body }) => {
          expect(emojis).toContain(body.data.emoji);
          expect(body.data.browser).toBe(`Thunder`);
        });
    });

    it(`devrait renvoyer l'emoji si l'index est valide`, () => {
      const emojis = appService.getEmojis();
      const index = 0;
      const indexEmoji = emojis[index];
      return request(server)
        .get(`/?index=${index}`)
        .set(`x-api-key`, `secret`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.emoji).toBe(indexEmoji);
        });
    });

    it(`devrait renvoyer 400 si l'index est superieur à la plage d'index`, () => {
      const emojis = appService.getEmojis();
      const emojisLength = emojis.length;
      const range = emojisLength + 1;
      return request(server)
        .get(`/?index=${range}`)
        .set(`x-api-key`, `secret`)
        .expect(400);
    });

    it(`devrait renvoyer 400 si l'index n'est pas un nombre`, () => {
      return request(server)
        .get(`/?index=non-nombre`)
        .set(`x-api-key`, `secret`)
        .expect(400);
    });
  });
});
