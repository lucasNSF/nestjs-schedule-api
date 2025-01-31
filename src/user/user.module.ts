import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './entities/mongodb-user.entity';
import { MongoDBUserRepository } from './repositories/mongodb-user.repository';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    { provide: UserRepository, useClass: MongoDBUserRepository },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
