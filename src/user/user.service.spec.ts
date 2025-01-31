import { Test } from '@nestjs/testing';

import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'src/utils/mongodb-testing.utils';
import { User, UserSchema } from './entities/mongodb-user.entity';
import { MongoDBUserRepository } from './repositories/mongodb-user.repository';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let userModel: Model<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [
        { provide: UserRepository, useClass: MongoDBUserRepository },
        UserService,
      ],
    }).compile();

    userService = moduleRef.get(UserService);
    userRepository = moduleRef.get(UserRepository);
    userModel = moduleRef.get(getModelToken(User.name));
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });

  describe('create(props):', () => {
    it('should create anonymous user', async () => {
      const user = await userService.create({});
      const outputUser = await userRepository.getUserByUsername(user.username);

      expect(user.email).toBe(undefined);
      expect(user.isAnonymous).toBe(true);
      expect(outputUser).toBeTruthy();
      expect(outputUser.isAnonymous).toBe(true);
      expect(outputUser.email).toBeFalsy();
    });

    it('should create user with email and password', async () => {
      const email = 'test@gmail.com';
      const password = 'strongPASSW12@!';

      const user = await userService.create({ email, password });
      const userEntity = await userRepository.getUserByUsername(user.username);
      const userInDatabase = await userModel.findById(userEntity.id).lean();

      expect(userEntity.email).toBe(email);
      expect(userEntity.isAnonymous).toBe(false);
      expect(userInDatabase.password).toBeTruthy();
      expect(userInDatabase.password).not.toStrictEqual(password);
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
