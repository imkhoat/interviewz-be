import { User } from '@modules/user/entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}
