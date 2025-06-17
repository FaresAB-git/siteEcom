import { Module } from '@nestjs/common';
import { StockPrevService } from './stock-prev.service';
import { StockPrevController } from './stock-prev.controller';

@Module({
  controllers: [StockPrevController],
  providers: [StockPrevService],
})
export class StockPrevModule {}
