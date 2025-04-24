import { UserRole } from '../../user/user.entity';

export class LoginResponseDto {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: UserRole;
    createdAt: Date;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
} 