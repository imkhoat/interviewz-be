import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@modules/user/enums/user-role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
