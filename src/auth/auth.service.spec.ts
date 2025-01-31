import { Test } from '@nestjs/testing';
import { MongoDBUserRepository } from 'src/user/repositories/mongodb-user.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserService } from 'src/user/user.service';

import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'src/utils/mongodb-testing.utils';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/mongodb-user.entity';

describe('UserService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [
        { provide: UserRepository, useClass: MongoDBUserRepository },
        UserService,
        AuthService,
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
  });
});
