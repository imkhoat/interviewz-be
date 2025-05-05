import { PartialType } from '@nestjs/mapped-types';
import { CreatePolicyDto } from '@modules/policy/dto/create-policy.dto';

export class UpdatePolicyDto extends PartialType(CreatePolicyDto) {}
