import { Injectable } from '@nestjs/common';

import { OutputCreateUserDTO } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export abstract class UserRepository {
  abstract create(props: Omit<UserEntity, 'id'>): Promise<OutputCreateUserDTO>;

  abstract getUserByUsername(
    username: string,
  ): Promise<OutputCreateUserDTO | null>;
}
