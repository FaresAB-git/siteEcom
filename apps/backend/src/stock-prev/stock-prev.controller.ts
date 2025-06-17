import { Controller, Get, Post } from '@nestjs/common';
import { StockPrevService } from './stock-prev.service';

@Controller('stock-prev')
export class StockPrevController {
  constructor(private readonly stockPrevService: StockPrevService) {}

  @Get('ma')
  async getStockMA() {
    return this.stockPrevService.getStockMA(1);
  }


  @Get('ses')
  async getStockSES() {
    return this.stockPrevService.getStockForecastSESForProduct(1, 0.3);
  }


  @Get('des')
  async getStockDES() {
    return this.stockPrevService.getStockForecastDESForProduct(1, 0.8, 0.2);
  }

  @Post('genererCommandeTest')
  async genererCommandeTest(){
    return this.stockPrevService.generateGrowingFakeCommandesForProduct(1);
  }
}
