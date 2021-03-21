import { Roles } from '../../../constants/roles.constant';

export interface IJwtPayload {
  email: string;
  sub: {
    id: string;
    roles: Roles[];
  };
}
