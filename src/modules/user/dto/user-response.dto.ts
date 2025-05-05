import { UserRole } from '@modules/user/enums/user-role.enum';

export class UserResponseDto {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  userRole: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
