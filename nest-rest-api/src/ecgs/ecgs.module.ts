import { Module } from '@nestjs/common';
import { EcgsService } from './ecgs.service';
import { EcgsController } from './ecgs.controller';

@Module({
  controllers: [EcgsController],
  providers: [EcgsService],
})
export class EcgsModule {}
