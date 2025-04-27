import { UserRole } from '../user.entity';

export class UserResponseDto {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  userRole: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
