import { UserRole } from '../user.entity';

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
