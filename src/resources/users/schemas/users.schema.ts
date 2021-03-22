import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../../../constants/roles.constant';

export type UserDocumentType = User & Document;

@Schema()
export class User {
  _id: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
  roles: Roles[];

  @Prop()
  friendIds: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
