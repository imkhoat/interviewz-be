import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/entities/user.entity';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
