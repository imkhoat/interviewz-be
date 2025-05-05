import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuDto } from '@modules/menu/dto/create-menu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
