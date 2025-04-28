import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Policy } from './entities/policy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Policy])],
  exports: [TypeOrmModule],
})
export class PolicyModule {}
