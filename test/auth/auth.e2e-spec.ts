import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/auth/auth.module';
import { OutputCreateUserDTO } from 'src/user/dtos/create-user.dto';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'src/utils/mongodb-testing.utils';
import * as request from 'supertest';

describe('User Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AuthModule],
    }).compile();

    app = moduleRef.createNestApplication({ snapshot: true });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  describe('/POST loginAnonymous():', () => {
    it('should login as anonymous user', async () => {
      const response = await request(app.getHttpServer()).post(
        '/auth/login/anonymous',
      );
      const { message, code } = response.body;

      expect(response.status).toBe(HttpStatus.OK);
      expect(message).toBe('Login efetuado');
      expect(code).toBe(HttpStatus.OK);
    });
  });

  describe('/POST loginWithCredentials():', () => {
    it('should login with credentials', async () => {
      const password = 'strong_PASSW@1234';
      const server = app.getHttpServer();

      return request(server)
        .post('/user')
        .send({ email: 'test@email.com', password })
        .expect(HttpStatus.CREATED)
        .then((response) => {
          const user = response.body.data as OutputCreateUserDTO;

          return request(server)
            .post('/auth/login/with-credentials')
            .send({ username: user.username, password })
            .expect(HttpStatus.OK);
        })
        .then((response) => {
          const { message, code } = response.body;

          expect(message).toBe('Login efetuado');
          expect(code).toBe(HttpStatus.OK);
        });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  });
});
