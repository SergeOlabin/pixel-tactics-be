import { Roles } from '../../../constants/roles.constant';

export class UserEntity {
  // from MongoDB
  _id: string;
  username: string;
  password: string;
  email: string;
  roles: Roles[];
  friendIds: string[];
}
