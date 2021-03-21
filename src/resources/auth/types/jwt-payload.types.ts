import { Roles } from '../../../constants/roles.constant';

export interface IJwtPayload {
  username: string;
  sub: {
    id: string;
    roles: Roles[];
  };
}
