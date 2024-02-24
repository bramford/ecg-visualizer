import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateHomeDto {
  @IsNotEmpty()
  address: string;

  @IsNumber()
  landSizeSqm: number;

  @IsNumber()
  houseSizeSqm: number;
}
