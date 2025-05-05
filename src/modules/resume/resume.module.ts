import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@modules/auth/auth.module';
import { Resume } from '@modules/resume/entities/resume.entity';
import { ResumeDetail } from '@modules/resume/entities/resume-detail.entity';
import { ResumeSection } from '@modules/resume/entities/resume-section.entity';
import { WorkExperience } from '@modules/resume/entities/work-experience.entity';
import { Education } from '@modules/resume/entities/education.entity';
import { Skill } from '@modules/resume/entities/skill.entity';
import { Project } from '@modules/resume/entities/project.entity';
import { Certification } from '@modules/resume/entities/certification.entity';
import { CustomSection } from '@modules/resume/entities/custom-section.entity';
import { CustomItem } from '@modules/resume/entities/custom-item.entity';
import { ResumeVersion } from '@modules/resume/entities/resume-version.entity';
import { ResumeService } from '@modules/resume/services/resume.service';
import { ResumeController } from '@modules/resume/controllers/resume.controller';

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
