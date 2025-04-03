import { Controller, Delete, Get, Post } from '@nestjs/common';

@Controller('resume')
export class ResumeController {
  @Get()
  getAll() {
    return 'This action returns all resume';
  }
  @Get(':id')
  getById(id: string) {
    return `This action returns a #${id} resume`;
  }

  @Post()
  create(data: any) {
    return 'This action adds a new resume';
  }

  @Post(':id')
  update(id: string, data: any) {
    return `This action updates a #${id} resume`;
  }

  @Delete(':id/delete')
  delete(id: string) {
    return `This action removes a #${id} resume`;
  }

  @Get('user/:userId')
  getResumeByUserId(userId: string) {
    return `This action returns a #${userId} resume`;
  }
}
