import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import {
  InputCreateUserDTO,
  OutputCreateUserDTO,
} from './dtos/create-user.dto';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(props: InputCreateUserDTO): Promise<OutputCreateUserDTO> {
    const { email, password } = props;

    if ((!email && password) || (email && !password)) {
      throw Error(
        `Missing email or password when one of this properties is sent.`,
      );
    }

    const isAnonymous = email && password ? false : true;

    const encryptedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const id = randomUUID();

    const user: UserEntity = {
      id,
      username: `User-${id}`,
      email,
      password: encryptedPassword,
      isAnonymous,
    };

    this.userRepository.create(user);

    return {
      id: user.id,
      email: user.email,
      isAnonymous,
      username: user.username,
    };
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.getUserByUsername(username);
  }
}
