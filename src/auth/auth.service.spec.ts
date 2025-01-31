import { Test } from '@nestjs/testing';
import { MongoDBUserRepository } from 'src/user/repositories/mongodb-user.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserService } from 'src/user/user.service';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/mongodb-user.entity';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'src/utils/mongodb-testing.utils';
import { AuthService } from './auth.service';
import { stubEnv } from 'src/utils/stubenv-testing.utils';

describe('UserService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const JWT_SECRET = 'TESTING_SECRET';
    stubEnv('JWT_SECRET', JWT_SECRET);

    const moduleRef = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
          secret: JWT_SECRET,
        }),
      ],
      providers: [
        { provide: UserRepository, useClass: MongoDBUserRepository },
        UserService,
        AuthService,
        JwtService,
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    userService = moduleRef.get(UserService);
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });

  describe('loginAnonymous()', () => {
    it('should login as anonymous user', async () => {
      const user = await authService.loginAnonymous();

      expect(user.isAnonymous).toBe(true);
    });
  });

  describe('loginWithCredentials(username, password):', () => {
    it('should login with username and password', async () => {
      const user = await userService.create({
        email: 'test@email.com',
        password: 'test1234',
      });

      const loggedUser = await authService.loginWithCredentials(
        user.username,
        'test1234',
      );

      expect(loggedUser).toBeTruthy();
      expect(loggedUser.email).toBe('test@email.com');
    });

    it('should return JWT access token after login', async () => {
      const email = 'test@email.com';
      const password = 'test1234';
      const user = await userService.create({
        email,
        password,
      });

      const loggedUser = await authService.loginWithCredentials(
        user.username,
        password,
      );

      expect(loggedUser).toBeTruthy();
      expect(loggedUser.email).toBe(email);
      expect(loggedUser.accessToken).toBeTruthy();
    });
  });
});
