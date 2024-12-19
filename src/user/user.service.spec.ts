import { Test } from '@nestjs/testing';

import { InMemoryUserRepository } from './repositories/in-memory-user.repository';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useClass: InMemoryUserRepository },
      ],
    }).compile();

    userService = await moduleRef.resolve(UserService);
    userRepository = await moduleRef.resolve(UserRepository);
  });

  describe('create(props):', () => {
    it('should create anonymous user', async () => {
      const user = await userService.create({});
      const userEntity = await userRepository.getUserByUsername(user.username);

      expect(user.email).toBe(undefined);
      expect(user.isAnonymous).toBe(true);
      expect(userEntity.password).toBe(undefined);
    });

    it('should create user with email and password', async () => {
      const email = 'test@gmail.com';
      const password = 'strongPASSW12@!';
      const user = await userService.create({ email, password });
      const userEntity = await userRepository.getUserByUsername(user.username);

      expect(userEntity.email).toBe(email);
      expect(userEntity.password).toBeTruthy();
      expect(userEntity.password).not.toBe(password);
      expect(userEntity.isAnonymous).toBe(false);
    });

    it('should throw error when one email or password attributes are missing', async () => {
      const p1 = userService.create({ email: 'test@gmail.com' });
      const p2 = userService.create({ password: 'strongPASS@!123' });

      await expect(p1).rejects.toThrow();
      await expect(p2).rejects.toThrow();
    });
  });

  describe('getUserByUsername(username):', () => {
    it('should return user by username', async () => {
      const user = await userService.create({});
      const userEntity = await userService.getUserByUsername(user.username);

      expect(userEntity.id).toBe(user.id);
    });
  });
});
