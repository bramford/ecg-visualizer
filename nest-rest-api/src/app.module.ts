import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomesModule } from './homes/homes.module';

@Module({
  imports: [HomesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
