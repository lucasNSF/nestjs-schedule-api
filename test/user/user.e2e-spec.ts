import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { UserRepository } from '../../src/user/repositories/user.repository';
import { UserModule } from '../../src/user/user.module';
import { MongoDBUserRepository } from 'src/user/repositories/mongodb-user.repository';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'src/utils/mongodb-testing.utils';

describe('User Controller (e2e)', () => {
  let app: INestApplication;
  let userRepository: MongoDBUserRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), UserModule],
    })
      .overrideProvider(UserRepository)
      .useClass(MongoDBUserRepository)
      .compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    userRepository = moduleRef.get(UserRepository);

    await app.init();
  });

  describe('/POST create(input):', () => {
    it('should create anonymous user', async () => {
      return request(app.getHttpServer())
        .post('/user')
        .expect(HttpStatus.CREATED)
        .then((response) => {
          const { message, code, data } = response.body;

          expect(message).toBe('User created.');
          expect(code).toBe(HttpStatus.CREATED);
          expect(data.isAnonymous).toBe(true);
        });
    });

    it('should create user with email and password', async () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({ email: 'test@email.com', password: 'strongPASS@!1234' })
        .expect(HttpStatus.CREATED)
        .then((response) => {
          const { message, code, data } = response.body;

          expect(message).toBe('User created.');
          expect(code).toBe(HttpStatus.CREATED);
          expect(data.isAnonymous).toBe(false);
          expect(data.email).toBe('test@email.com');
        });
    });

    it('should return error if sent a weak password', async () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({ email: 'test@email.com', password: 'password1234' })
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          const { message, statusCode } = response.body;

          expect(message).toEqual(['password is not strong enough']);
          expect(statusCode).toBe(400);
        });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  });
});
