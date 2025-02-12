import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  email?: string;

  @Prop()
  password?: string;

  @Prop({ required: true })
  isAnonymous: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
