import { IsNumber, IsOptional } from 'class-validator';

export class GetEcgsQuery {
  @IsOptional()
  @IsNumber()
  /*
  @Validate((v: string | undefined) => {
    if (v == undefined) return;
    const n = Number(v);
    return n > 0 && n < 11;
  })
  */
  count?: number;
  @IsOptional()
  @IsNumber()
  offset?: number;
  @IsOptional()
  @IsNumber()
  readingsCount?: number;
  @IsOptional()
  @IsNumber()
  readingsOffset?: number;
}
