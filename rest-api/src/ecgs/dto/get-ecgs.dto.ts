import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GetEcgsQuery {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Max(10)
  @Min(1)
  count?: number;
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  offset?: number;
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Max(2500)
  @Min(1)
  readingsCount?: number;
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  readingsOffset?: number;
}
