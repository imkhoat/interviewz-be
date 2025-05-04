import { User } from '@modules/user/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.findOne({ where: { id } });
  }
}
