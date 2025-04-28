import { UserRole } from '../../user/user.entity';

export class LoginResponseDto {
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName: string;
    userRole: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
