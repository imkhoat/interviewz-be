import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Policy } from '@modules/policy/entities/policy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Policy])],
  exports: [TypeOrmModule],
})
export class PolicyModule {}
