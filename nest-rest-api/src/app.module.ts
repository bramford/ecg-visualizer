import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomesModule } from './homes/homes.module';
import { EcgsModule } from './ecgs/ecgs.module';

@Module({
  imports: [HomesModule, EcgsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
