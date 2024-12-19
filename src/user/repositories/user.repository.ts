import { Injectable } from '@nestjs/common';

import { UserEntity } from '../user.entity';

@Injectable()
export abstract class UserRepository {
  abstract create(props: UserEntity): Promise<void>;
  abstract getUserByUsername(username: string): Promise<UserEntity>;
}
