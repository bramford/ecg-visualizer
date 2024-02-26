import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { EcgsService } from './ecgs.service';
import { GetEcgsQuery } from './dto/get-ecgs.dto';

@Controller('ecgs')
export class EcgsController {
  constructor(private readonly ecgsService: EcgsService) {}

  @Get()
  async getMany(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: GetEcgsQuery,
  ) {
    return await this.ecgsService.findMany(query);
  }
}
