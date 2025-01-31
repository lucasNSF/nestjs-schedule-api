import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import {
  InputCreateUserDTO,
  OutputCreateUserDTO,
} from './dtos/create-user.dto';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

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

    const inputCreateUser: Omit<UserEntity, 'id'> = {
      username: `User-${randomUUID()}`,
      email,
      password: encryptedPassword,
      isAnonymous,
    };

    const outputUserDTO = await this.userRepository.create(inputCreateUser);

    return outputUserDTO;
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.getUserByUsername(username);
  }
}
