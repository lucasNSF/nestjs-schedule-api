import { Injectable } from '@nestjs/common';

import { UserEntity } from '../user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class InMemoryUserRepository extends UserRepository {
  private db: UserEntity[] = [];

  async create(props: UserEntity) {
    this.db.push(props);
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    return this.db.find((user) => user.username === username);
  }

  clear() {
    this.db = [];
  }
}
