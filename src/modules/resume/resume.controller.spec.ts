import { Test, TestingModule } from '@nestjs/testing';
import { ResumeController } from './resume.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('ResumeController', () => {
  let controller: ResumeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumeController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ResumeController>(ResumeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
