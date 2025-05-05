import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from '@modules/resource/dto/create-resource.dto';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {}
