import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@modules/auth/auth.module';
import { Resume } from './entities/resume.entity';
import { ResumeDetail } from './entities/resume-detail.entity';
import { ResumeSection } from './entities/resume-section.entity';
import { WorkExperience } from './entities/work-experience.entity';
import { Education } from './entities/education.entity';
import { Skill } from './entities/skill.entity';
import { Project } from './entities/project.entity';
import { Certification } from './entities/certification.entity';
import { CustomSection } from './entities/custom-section.entity';
import { CustomItem } from './entities/custom-item.entity';
import { ResumeVersion } from './entities/resume-version.entity';
import { ResumeService } from './services/resume.service';
import { ResumeController } from './controllers/resume.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Resume,
      ResumeDetail,
      ResumeSection,
      WorkExperience,
      Education,
      Skill,
      Project,
      Certification,
      CustomSection,
      CustomItem,
      ResumeVersion,
    ]),
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
