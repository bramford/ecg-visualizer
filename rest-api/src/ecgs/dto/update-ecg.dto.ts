import { PartialType } from '@nestjs/mapped-types';
import { CreateEcgDto } from './create-ecg.dto';

export class UpdateEcgDto extends PartialType(CreateEcgDto) {}
