import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../constants/roles.constant';

export const ROLES_KEY = 'roles';
export const RolesMeta = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
