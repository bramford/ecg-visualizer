import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
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

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const result = await this.ecgsService.findOne(id);
    if (result == undefined) throw new NotFoundException();
    return result;
  }
}
