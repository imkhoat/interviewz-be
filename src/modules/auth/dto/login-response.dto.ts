import { UserRole } from '@modules/user/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      email: { type: 'string', example: 'user@example.com' },
      firstName: { type: 'string', example: 'John', required: false },
      lastName: { type: 'string', example: 'Doe', required: false },
      fullName: { type: 'string', example: 'John Doe' },
      userRole: {
        type: 'string',
        enum: Object.values(UserRole),
        example: UserRole.CANDIDATE,
      },
      isActive: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  })
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

  @ApiProperty({
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      refreshToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
