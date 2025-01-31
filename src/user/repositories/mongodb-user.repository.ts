import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, FlattenMaps, Model, Types } from 'mongoose';

import { OutputCreateUserDTO } from '../dtos/create-user.dto';
import { User } from '../entities/mongodb-user.entity';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from './user.repository';

type MongoDoc = (Document | FlattenMaps<User>) & User & { _id: Types.ObjectId };

@Injectable()
export class MongoDBUserRepository extends UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super();
  }

  async create(props: Omit<UserEntity, 'id'>): Promise<OutputCreateUserDTO> {
    try {
      const createdUser = await this.userModel.create({
        email: props.email,
        isAnonymous: props.isAnonymous,
        password: props.password,
        username: props.username,
      });

      const outputCreateUserDTO = this.toOutputCreateUserDTO(createdUser);

      return outputCreateUserDTO;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getUserByUsername(
    username: string,
  ): Promise<OutputCreateUserDTO | null> {
    try {
      const user = await this.userModel.findOne({ username }).lean();

      if (!user) {
        return null;
      }

      const outputCreateUserDTO = this.toOutputCreateUserDTO(user);

      return outputCreateUserDTO;
    } catch (err) {
      console.error(err);
    }
  }

  private toOutputCreateUserDTO(doc: MongoDoc): OutputCreateUserDTO {
    return {
      id: doc._id.toHexString(),
      email: doc.email,
      isAnonymous: doc.isAnonymous,
      username: doc.username,
    };
  }
}
