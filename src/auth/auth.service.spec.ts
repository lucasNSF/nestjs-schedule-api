import { Test } from '@nestjs/testing';
import { InMemoryUserRepository } from 'src/user/repositories/in-memory-user.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserService } from 'src/user/user.service';

import { AuthService } from './auth.service';

describe('UserService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        { provide: UserRepository, useClass: InMemoryUserRepository },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    userService = moduleRef.get(UserService);
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
